import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { OtpDocument } from './schemas/otp.schema';
import { LoggerService } from '../common/services/logger.service';
export declare class OtpService {
    private otpModel;
    private logger;
    private configService;
    private verifyAttempts;
    private requestRate;
    constructor(otpModel: Model<OtpDocument>, logger: LoggerService, configService: ConfigService);
    private phoneKey;
    generateOtp(): string;
    private checkRequestRateLimit;
    createOtp(countryCode: string, phoneNumber: string): Promise<string>;
    private static readonly SEED_PLATFORM_OWNER;
    verifyOtp(countryCode: string, phoneNumber: string, code: string): Promise<boolean>;
}
