import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { OtpService } from './otp.service';
import { LoggerService } from '../common/services/logger.service';
import {
  Organization,
  OrganizationDocument,
} from '../organizations/schemas/organization.schema';
import {
  normalizeCountryCode,
  normalizePhoneNumber,
  countryCodeQueryVariants,
} from '../common/helpers/phone';
import { ROLES } from '../common/constants/roles';

/** Role priority for picking one user when multiple match same org+phone (higher = prefer). */
const ROLE_PRIORITY: Record<string, number> = {
  [ROLES.PLATFORM_OWNER]: 4,
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.ADMIN]: 2,
  [ROLES.USER]: 1,
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  /**
   * Resolve user lookup filter by optional organizationId.
   * Matches both "91" and "+91" in DB via $in so we find the same user regardless of how frontend sends it.
   */
  private userFindFilter(
    countryCode: string,
    phoneNumber: string,
    organizationId?: string | null,
  ) {
    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const base: Record<string, unknown> = {
      countryCode: { $in: countryCodeQueryVariants(normalizedCountry) },
      phoneNumber: normalizedPhone,
    };
    if (organizationId?.trim()) {
      base.organizationId = new Types.ObjectId(organizationId.trim());
    } else {
      base.$or = [
        { organizationId: null },
        { organizationId: { $exists: false } },
      ];
    }
    return base;
  }

  /**
   * Find one user by phone/org; when multiple match (e.g. same number stored as "91" and "+91"), prefer SUPER_ADMIN > ADMIN > USER.
   */
  private async findOneUserByPhone(
    countryCode: string,
    phoneNumber: string,
    organizationId?: string | null,
  ): Promise<UserDocument | null> {
    const filter = this.userFindFilter(countryCode, phoneNumber, organizationId);
    const users = await this.userModel.find(filter).exec();
    if (users.length === 0) return null;
    if (users.length === 1) return users[0];
    users.sort((a, b) => (ROLE_PRIORITY[b.role ?? 'USER'] ?? 0) - (ROLE_PRIORITY[a.role ?? 'USER'] ?? 0));
    return users[0];
  }

  /**
   * Validate organization exists when organizationId is provided.
   */
  private async validateOrganizationId(
    organizationId: string | null | undefined,
  ): Promise<void> {
    if (!organizationId?.trim()) return;
    const org = await this.organizationModel.findById(
      new Types.ObjectId(organizationId.trim()),
    );
    if (!org) {
      throw new BadRequestException('Invalid or unknown organization ID');
    }
  }

  /**
   * Unified request OTP - works for both new and existing users.
   * Optional header x-org-id: when present, user is scoped to that organisation.
   */
  async requestOtp(
    requestOtpDto: RequestOtpDto,
    organizationId?: string | null,
  ) {
    const { countryCode, phoneNumber } = requestOtpDto;
    await this.validateOrganizationId(organizationId);

    const existingUser = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);
    const isNewUser = !existingUser;

    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    await this.otpService.createOtp(normalizedCountry, normalizedPhone);

    return { isNewUser };
  }

  /**
   * Resend OTP - returns same OTP if still valid, otherwise generates new one.
   * Optional header x-org-id: when present, user is scoped to that organisation.
   */
  async resendOtp(
    requestOtpDto: RequestOtpDto,
    organizationId?: string | null,
  ) {
    const { countryCode, phoneNumber } = requestOtpDto;
    await this.validateOrganizationId(organizationId);

    const existingUser = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);
    const isNewUser = !existingUser;

    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    await this.otpService.createOtp(normalizedCountry, normalizedPhone);

    return { isNewUser, message: 'OTP sent successfully' };
  }

  /**
   * Unified verify OTP - works for both sign up and login.
   * Optional header x-org-id: when present, user is created/found in that organisation.
   */
  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    organizationId?: string | null,
  ) {
    const { countryCode, phoneNumber, otp, name } = verifyOtpDto;
    await this.validateOrganizationId(organizationId);

    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const isValidOtp = await this.otpService.verifyOtp(
      normalizedCountry,
      normalizedPhone,
      otp,
    );
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);

    if (!user) {
      const createPayload: Record<string, unknown> = {
        countryCode: normalizedCountry,
        phoneNumber: normalizedPhone,
        name,
        isVerified: true,
        role: 'USER',
      };
      if (organizationId?.trim()) {
        createPayload.organizationId = new Types.ObjectId(
          organizationId.trim(),
        );
      }
      user = await this.userModel.create(createPayload);
    } else {
      user.isVerified = true;
      if (name && !user.name) {
        user.name = name;
      }
      // Normalize stored values so DB converges to single format
      user.countryCode = normalizedCountry;
      user.phoneNumber = normalizedPhone;
      await user.save();
    }

    // Generate tokens (include role and org so clients can use without calling profile)
    const payload = {
      sub: user._id.toString(),
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      role: user.role ?? 'USER',
      organizationId: user.organizationId?.toString() ?? null,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
    });

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
    const expiresInSeconds = this.parseExpiresIn(expiresIn);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // Return only data - interceptor will wrap in {success: true, data: {...}}
    return {
      token: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString(),
      },
      user: {
        id: user._id,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role ?? 'USER',
        organizationId: user.organizationId?.toString() ?? null,
      },
    };
  }

  /**
   * Get current user profile from DB (role, name, email, etc.) so clients always see up-to-date role.
   */
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id.toString(),
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      role: user.role ?? 'USER',
      organizationId: user.organizationId?.toString() ?? null,
      isVerified: user.isVerified,
    };
  }

  /**
   * Parse expires in string to seconds
   */
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60; // Default 7 days in seconds
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60;
    }
  }
}

