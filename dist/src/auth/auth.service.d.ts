import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from './schemas/user.schema';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { OtpService } from './otp.service';
import { LoggerService } from '../common/services/logger.service';
import { OrganizationDocument } from '../organizations/schemas/organization.schema';
export declare class AuthService {
    private userModel;
    private organizationModel;
    private jwtService;
    private configService;
    private otpService;
    private logger;
    constructor(userModel: Model<UserDocument>, organizationModel: Model<OrganizationDocument>, jwtService: JwtService, configService: ConfigService, otpService: OtpService, logger: LoggerService);
    private userFindFilter;
    private findOneUserByPhone;
    private validateOrganizationId;
    requestOtp(requestOtpDto: RequestOtpDto, organizationId?: string | null): Promise<{
        isNewUser: boolean;
    }>;
    resendOtp(requestOtpDto: RequestOtpDto, organizationId?: string | null): Promise<{
        isNewUser: boolean;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto, organizationId?: string | null): Promise<{
        token: {
            accessToken: string;
            refreshToken: string;
            expiresAt: string;
        };
        user: {
            id: Types.ObjectId;
            countryCode: string;
            phoneNumber: string;
            name: string;
            isVerified: boolean;
            role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
            organizationId: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        countryCode: string;
        phoneNumber: string;
        name: string;
        email: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        organizationId: string;
        isVerified: boolean;
    }>;
    private parseExpiresIn;
}
