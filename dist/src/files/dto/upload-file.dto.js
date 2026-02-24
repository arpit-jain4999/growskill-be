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
exports.TestUploadDto = exports.CompleteUploadDto = exports.InitiateUploadDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class InitiateUploadDto {
}
exports.InitiateUploadDto = InitiateUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohort-icon.png', description: 'File name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateUploadDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png', description: 'File MIME type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateUploadDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cohorts/icons/mobile', description: 'Optional folder path for file organization' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitiateUploadDto.prototype, "folder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://api.example.com/webhooks/file-uploaded', description: 'Optional callback URL to notify when upload is complete' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitiateUploadDto.prototype, "callbackUrl", void 0);
class CompleteUploadDto {
}
exports.CompleteUploadDto = CompleteUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-1234-5678', description: 'Upload ID from initiate upload' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'File key from initiate upload' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "fileKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12345', description: 'File size in bytes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "fileSize", void 0);
class TestUploadDto {
}
exports.TestUploadDto = TestUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test-file.png', description: 'File name for testing' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestUploadDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png', description: 'File MIME type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestUploadDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'test', description: 'Optional folder path for testing' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TestUploadDto.prototype, "folder", void 0);
//# sourceMappingURL=upload-file.dto.js.map