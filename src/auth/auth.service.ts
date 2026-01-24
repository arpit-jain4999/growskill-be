import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { OtpService } from './otp.service';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  /**
   * Unified request OTP - works for both new and existing users
   */
  async requestOtp(requestOtpDto: RequestOtpDto) {
    const { countryCode, phoneNumber } = requestOtpDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({
      countryCode,
      phoneNumber,
    });

    const isNewUser = !existingUser;

    // Generate and send OTP (returns existing if still valid)
    await this.otpService.createOtp(countryCode, phoneNumber);

    // Return only data - interceptor will wrap in {success: true, data: {...}}
    return {
      isNewUser,
    };
  }

  /**
   * Resend OTP - returns same OTP if still valid, otherwise generates new one
   */
  async resendOtp(requestOtpDto: RequestOtpDto) {
    const { countryCode, phoneNumber } = requestOtpDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({
      countryCode,
      phoneNumber,
    });

    const isNewUser = !existingUser;

    // Create OTP (will return existing if still valid within 5 minutes)
    await this.otpService.createOtp(countryCode, phoneNumber);

    // Return only data - interceptor will wrap in {success: true, data: {...}}
    return {
      isNewUser,
      message: 'OTP sent successfully',
    };
  }

  /**
   * Unified verify OTP - works for both sign up and login
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { countryCode, phoneNumber, otp, name } = verifyOtpDto;

    // Verify OTP
    const isValidOtp = await this.otpService.verifyOtp(
      countryCode,
      phoneNumber,
      otp,
    );
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Find or create user
    let user = await this.userModel.findOne({ countryCode, phoneNumber });

    if (!user) {
      // New user - create account
      user = await this.userModel.create({
        countryCode,
        phoneNumber,
        name,
        isVerified: true,
      });
    } else {
      // Existing user - update verification status
      user.isVerified = true;
      if (name && !user.name) {
        user.name = name;
      }
      await user.save();
    }

    // Generate tokens
    const payload = {
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      sub: user._id,
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
      },
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

