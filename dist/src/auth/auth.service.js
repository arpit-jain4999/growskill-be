"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("./schemas/user.schema");
const otp_service_1 = require("./otp.service");
const logger_service_1 = require("../common/services/logger.service");
const organization_schema_1 = require("../organizations/schemas/organization.schema");
const phone_1 = require("../common/helpers/phone");
const roles_1 = require("../common/constants/roles");
const ROLE_PRIORITY = {
    [roles_1.ROLES.PLATFORM_OWNER]: 4,
    [roles_1.ROLES.SUPER_ADMIN]: 3,
    [roles_1.ROLES.ADMIN]: 2,
    [roles_1.ROLES.USER]: 1,
};
let AuthService = class AuthService {
    constructor(userModel, organizationModel, jwtService, configService, otpService, logger) {
        this.userModel = userModel;
        this.organizationModel = organizationModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.otpService = otpService;
        this.logger = logger;
        this.logger.setContext('AuthService');
    }
    userFindFilter(countryCode, phoneNumber, organizationId) {
        const normalizedCountry = (0, phone_1.normalizeCountryCode)(countryCode);
        const normalizedPhone = (0, phone_1.normalizePhoneNumber)(phoneNumber);
        const base = {
            countryCode: { $in: (0, phone_1.countryCodeQueryVariants)(normalizedCountry) },
            phoneNumber: normalizedPhone,
        };
        if (organizationId?.trim()) {
            base.organizationId = new mongoose_2.Types.ObjectId(organizationId.trim());
        }
        else {
            base.$or = [
                { organizationId: null },
                { organizationId: { $exists: false } },
            ];
        }
        return base;
    }
    async findOneUserByPhone(countryCode, phoneNumber, organizationId) {
        const filter = this.userFindFilter(countryCode, phoneNumber, organizationId);
        const users = await this.userModel.find(filter).exec();
        if (users.length === 0)
            return null;
        if (users.length === 1)
            return users[0];
        users.sort((a, b) => (ROLE_PRIORITY[b.role ?? 'USER'] ?? 0) - (ROLE_PRIORITY[a.role ?? 'USER'] ?? 0));
        return users[0];
    }
    async validateOrganizationId(organizationId) {
        if (!organizationId?.trim())
            return;
        const org = await this.organizationModel.findById(new mongoose_2.Types.ObjectId(organizationId.trim()));
        if (!org) {
            throw new common_1.BadRequestException('Invalid or unknown organization ID');
        }
    }
    async requestOtp(requestOtpDto, organizationId) {
        const { countryCode, phoneNumber } = requestOtpDto;
        await this.validateOrganizationId(organizationId);
        const existingUser = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);
        const isNewUser = !existingUser;
        const normalizedCountry = (0, phone_1.normalizeCountryCode)(countryCode);
        const normalizedPhone = (0, phone_1.normalizePhoneNumber)(phoneNumber);
        await this.otpService.createOtp(normalizedCountry, normalizedPhone);
        return { isNewUser };
    }
    async resendOtp(requestOtpDto, organizationId) {
        const { countryCode, phoneNumber } = requestOtpDto;
        await this.validateOrganizationId(organizationId);
        const existingUser = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);
        const isNewUser = !existingUser;
        const normalizedCountry = (0, phone_1.normalizeCountryCode)(countryCode);
        const normalizedPhone = (0, phone_1.normalizePhoneNumber)(phoneNumber);
        await this.otpService.createOtp(normalizedCountry, normalizedPhone);
        return { isNewUser, message: 'OTP sent successfully' };
    }
    async verifyOtp(verifyOtpDto, organizationId) {
        const { countryCode, phoneNumber, otp, name } = verifyOtpDto;
        await this.validateOrganizationId(organizationId);
        const normalizedCountry = (0, phone_1.normalizeCountryCode)(countryCode);
        const normalizedPhone = (0, phone_1.normalizePhoneNumber)(phoneNumber);
        const isValidOtp = await this.otpService.verifyOtp(normalizedCountry, normalizedPhone, otp);
        if (!isValidOtp) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        let user = await this.findOneUserByPhone(countryCode, phoneNumber, organizationId);
        if (!user) {
            const createPayload = {
                countryCode: normalizedCountry,
                phoneNumber: normalizedPhone,
                name,
                isVerified: true,
                role: 'USER',
            };
            if (organizationId?.trim()) {
                createPayload.organizationId = new mongoose_2.Types.ObjectId(organizationId.trim());
            }
            user = await this.userModel.create(createPayload);
        }
        else {
            user.isVerified = true;
            if (name && !user.name) {
                user.name = name;
            }
            user.countryCode = normalizedCountry;
            user.phoneNumber = normalizedPhone;
            await user.save();
        }
        const payload = {
            sub: user._id.toString(),
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            role: user.role ?? 'USER',
            organizationId: user.organizationId?.toString() ?? null,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d',
        });
        const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '7d';
        const expiresInSeconds = this.parseExpiresIn(expiresIn);
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
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
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
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
    parseExpiresIn(expiresIn) {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 7 * 24 * 60 * 60;
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        otp_service_1.OtpService,
        logger_service_1.LoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map