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
exports.UserProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserProfileResponseDto {
}
exports.UserProfileResponseDto = UserProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country code (e.g. 91 for India)',
        example: '91',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '9876543210',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'First name',
        example: 'John',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last name',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name (may be first + last or custom)',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the user has verified their phone',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserProfileResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile picture URL',
        example: 'https://example.com/avatars/john.jpg',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User bio',
        example: 'Software developer',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "bio", void 0);
//# sourceMappingURL=user-profile-response.dto.js.map