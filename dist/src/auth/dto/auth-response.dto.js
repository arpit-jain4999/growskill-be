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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpResponseDto = exports.ProfileResponseDto = exports.VerifyOtpResponseDto = exports.UserDto = exports.TokenDto = exports.RequestOtpResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RequestOtpResponseDto {
}
exports.RequestOtpResponseDto = RequestOtpResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates if the user is new' }),
    __metadata("design:type", Boolean)
], RequestOtpResponseDto.prototype, "isNewUser", void 0);
class TokenDto {
}
exports.TokenDto = TokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' }),
    __metadata("design:type", String)
], TokenDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT refresh token' }),
    __metadata("design:type", String)
], TokenDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-31T12:00:00.000Z', description: 'Token expiration timestamp' }),
    __metadata("design:type", String)
], TokenDto.prototype, "expiresAt", void 0);
class UserDto {
}
exports.UserDto = UserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'User ID' }),
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+91', description: 'Country code' }),
    __metadata("design:type", String)
], UserDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9876543210', description: 'Phone number' }),
    __metadata("design:type", String)
], UserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'User name', required: false }),
    __metadata("design:type", String)
], UserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Is user verified' }),
    __metadata("design:type", Boolean)
], UserDto.prototype, "isVerified", void 0);
class VerifyOtpResponseDto {
}
exports.VerifyOtpResponseDto = VerifyOtpResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: TokenDto }),
    __metadata("design:type", TokenDto)
], VerifyOtpResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserDto }),
    __metadata("design:type", UserDto)
], VerifyOtpResponseDto.prototype, "user", void 0);
class ProfileResponseDto {
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserDto }),
    __metadata("design:type", UserDto)
], ProfileResponseDto.prototype, "user", void 0);
class ResendOtpResponseDto {
}
exports.ResendOtpResponseDto = ResendOtpResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates if the user is new' }),
    __metadata("design:type", Boolean)
], ResendOtpResponseDto.prototype, "isNewUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTP sent successfully', description: 'Success message' }),
    __metadata("design:type", String)
], ResendOtpResponseDto.prototype, "message", void 0);
//# sourceMappingURL=auth-response.dto.js.map