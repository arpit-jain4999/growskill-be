export declare class RequestOtpDto {
    countryCode: string;
    phoneNumber: string;
}
export declare class VerifyOtpDto {
    countryCode: string;
    phoneNumber: string;
    otp: string;
    name?: string;
}
