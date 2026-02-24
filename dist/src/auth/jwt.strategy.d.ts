import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userModel;
    constructor(configService: ConfigService, userModel: Model<UserDocument>);
    validate(payload: {
        sub: string;
        countryCode?: string;
        phoneNumber?: string;
    }): Promise<{
        userId: string;
        organizationId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        permissions: any[];
        countryCode: string;
        phoneNumber: string;
    }>;
}
export {};
