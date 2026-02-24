import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    requestOtp(requestOtpDto: RequestOtpDto, xOrgId?: string): Promise<{
        isNewUser: boolean;
    }>;
    resendOtp(requestOtpDto: RequestOtpDto, xOrgId?: string): Promise<{
        isNewUser: boolean;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto, xOrgId?: string): Promise<{
        token: {
            accessToken: string;
            refreshToken: string;
            expiresAt: string;
        };
        user: {
            id: import("mongoose").Types.ObjectId;
            countryCode: string;
            phoneNumber: string;
            name: string;
            isVerified: boolean;
            role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
            organizationId: string;
        };
    }>;
    getProfile(user: CurrentUserPayload): Promise<{
        user: {
            id: string;
            countryCode: string;
            phoneNumber: string;
            name: string;
            email: string;
            role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
            organizationId: string;
            isVerified: boolean;
        };
    }>;
}
