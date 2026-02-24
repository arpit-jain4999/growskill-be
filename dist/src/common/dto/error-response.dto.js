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
exports.StandardErrorResponseDto = exports.ErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Invalid or expired OTP', description: 'Error message' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400, description: 'HTTP status code' }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-23T12:00:00.000Z', description: 'Error timestamp' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/auth/verify-otp', description: 'Request path' }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "path", void 0);
class StandardErrorResponseDto {
}
exports.StandardErrorResponseDto = StandardErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Success indicator' }),
    __metadata("design:type", Boolean)
], StandardErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ErrorResponseDto }),
    __metadata("design:type", ErrorResponseDto)
], StandardErrorResponseDto.prototype, "error", void 0);
//# sourceMappingURL=error-response.dto.js.map