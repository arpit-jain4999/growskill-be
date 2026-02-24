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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const X_ORG_ID = 'x-org-id';
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async requestOtp(requestOtpDto, xOrgId) {
        return await this.authService.requestOtp(requestOtpDto, xOrgId);
    }
    async resendOtp(requestOtpDto, xOrgId) {
        return await this.authService.resendOtp(requestOtpDto, xOrgId);
    }
    async verifyOtp(verifyOtpDto, xOrgId) {
        return await this.authService.verifyOtp(verifyOtpDto, xOrgId);
    }
    async getProfile(user) {
        const profile = await this.authService.getProfile(user.userId);
        return { user: profile };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('request-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request OTP for phone number',
        description: 'Send OTP to user phone number. Works for both new and existing users. Optional header x-org-id: when present, user is scoped to that organisation.',
    }),
    (0, swagger_1.ApiHeader)({ name: X_ORG_ID, required: false, description: 'Organization ID (MongoDB ObjectId). When provided, user is created/found in this organisation.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'OTP sent successfully', type: auth_response_dto_1.RequestOtpResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request - Invalid phone number or country code', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)(X_ORG_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RequestOtpDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Resend OTP',
        description: 'Resend OTP to user phone number. Optional header x-org-id: when present, user is scoped to that organisation.',
    }),
    (0, swagger_1.ApiHeader)({ name: X_ORG_ID, required: false, description: 'Organization ID. When provided, user is scoped to this organisation.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'OTP resent successfully', type: auth_response_dto_1.ResendOtpResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request - Invalid phone number or country code', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)(X_ORG_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RequestOtpDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify OTP',
        description: 'Verify OTP and return JWT tokens. Creates new user if not exists. Optional header x-org-id: when present, user is created/found in that organisation.',
    }),
    (0, swagger_1.ApiHeader)({ name: X_ORG_ID, required: false, description: 'Organization ID. When provided, user is created/found in this organisation.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'OTP verified successfully, returns JWT tokens', type: auth_response_dto_1.VerifyOtpResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid or expired OTP', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request - Invalid input or invalid organisation', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)(X_ORG_ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyOtpDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile', description: 'Get authenticated user profile information' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User profile retrieved successfully',
        type: auth_response_dto_1.ProfileResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - Invalid or missing JWT token',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map