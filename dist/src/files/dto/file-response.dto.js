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
exports.TestUploadResponseDto = exports.CompleteUploadResponseDto = exports.InitiateUploadResponseDto = exports.FileInfoResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FileInfoResponseDto {
}
exports.FileInfoResponseDto = FileInfoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'File ID' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohort-icon.png', description: 'File name' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'File key/path' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com', description: 'Base URL' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "baseUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'Complete image URL' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "imgUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'image/png', description: 'MIME type' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12345, description: 'File size in bytes' }),
    __metadata("design:type", Number)
], FileInfoResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-23T12:00:00.000Z', description: 'Creation timestamp' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-23T12:00:00.000Z', description: 'Last update timestamp' }),
    __metadata("design:type", String)
], FileInfoResponseDto.prototype, "updatedAt", void 0);
class InitiateUploadResponseDto {
}
exports.InitiateUploadResponseDto = InitiateUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-1234-5678', description: 'Upload ID for tracking' }),
    __metadata("design:type", String)
], InitiateUploadResponseDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'Generated file key' }),
    __metadata("design:type", String)
], InitiateUploadResponseDto.prototype, "fileKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.example.com/upload?key=...', description: 'Signed URL for upload' }),
    __metadata("design:type", String)
], InitiateUploadResponseDto.prototype, "signedUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600, description: 'URL expiration time in seconds' }),
    __metadata("design:type", Number)
], InitiateUploadResponseDto.prototype, "expiresIn", void 0);
class CompleteUploadResponseDto {
}
exports.CompleteUploadResponseDto = CompleteUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'File ID' }),
    __metadata("design:type", String)
], CompleteUploadResponseDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FileInfoResponseDto }),
    __metadata("design:type", FileInfoResponseDto)
], CompleteUploadResponseDto.prototype, "file", void 0);
class TestUploadResponseDto {
}
exports.TestUploadResponseDto = TestUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-1234-5678', description: 'Upload ID' }),
    __metadata("design:type", String)
], TestUploadResponseDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test/1234567890_abc123_test-file.png', description: 'File key' }),
    __metadata("design:type", String)
], TestUploadResponseDto.prototype, "fileKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.example.com/upload?key=...', description: 'Signed URL' }),
    __metadata("design:type", String)
], TestUploadResponseDto.prototype, "signedUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Upload initiated. Use the complete endpoint to finish the upload.', description: 'Instructions' }),
    __metadata("design:type", String)
], TestUploadResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/files/upload/complete', description: 'Complete upload endpoint' }),
    __metadata("design:type", String)
], TestUploadResponseDto.prototype, "completeEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { uploadId: 'uuid-1234-5678', fileKey: 'test/1234567890_abc123_test-file.png' },
        description: 'Payload for complete endpoint'
    }),
    __metadata("design:type", Object)
], TestUploadResponseDto.prototype, "completePayload", void 0);
//# sourceMappingURL=file-response.dto.js.map