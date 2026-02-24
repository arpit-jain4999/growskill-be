export declare class RequestOtpResponseDto {
    isNewUser: boolean;
}
export declare class TokenDto {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}
export declare class UserDto {
    id: string;
    countryCode: string;
    phoneNumber: string;
    name?: string;
    isVerified: boolean;
}
export declare class VerifyOtpResponseDto {
    token: TokenDto;
    user: UserDto;
}
export declare class ProfileResponseDto {
    user: UserDto;
}
export declare class ResendOtpResponseDto {
    isNewUser: boolean;
    message: string;
}
