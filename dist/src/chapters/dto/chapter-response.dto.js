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
exports.ChapterListApiResponseDto = exports.ChapterApiResponseDto = exports.ChapterResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChapterResponseDto {
}
exports.ChapterResponseDto = ChapterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Chapter ID', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439020', description: 'Organization ID', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439015', description: 'Module ID this chapter belongs to', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Variables and Data Types', description: 'Chapter title', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Learn about JS variables', description: 'Chapter description', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Display order within the module (0-based)', type: Number }),
    __metadata("design:type", Number)
], ChapterResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the chapter is active / visible', type: Boolean }),
    __metadata("design:type", Boolean)
], ChapterResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '# Variables\n\nJavaScript has three ways…', description: 'Rich-text / markdown content', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/chapters/variables.mp4', description: 'Video URL', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/chapters/variables.pdf', description: 'PDF URL', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "pdfUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/chapters/thumb.png', description: 'Thumbnail URL', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Duration in minutes', type: Number }),
    __metadata("design:type", Number)
], ChapterResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'video', description: 'Content type (video | pdf | text | mixed)', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:00:00.000Z', description: 'Creation timestamp', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-20T14:30:00.000Z', description: 'Last update timestamp', type: String }),
    __metadata("design:type", String)
], ChapterResponseDto.prototype, "updatedAt", void 0);
class ChapterApiResponseDto {
}
exports.ChapterApiResponseDto = ChapterApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates the request succeeded', type: Boolean }),
    __metadata("design:type", Boolean)
], ChapterApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The chapter object', type: ChapterResponseDto }),
    __metadata("design:type", ChapterResponseDto)
], ChapterApiResponseDto.prototype, "data", void 0);
class ChapterListApiResponseDto {
}
exports.ChapterListApiResponseDto = ChapterListApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates the request succeeded', type: Boolean }),
    __metadata("design:type", Boolean)
], ChapterListApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of chapters', type: () => ChapterResponseDto, isArray: true }),
    __metadata("design:type", Array)
], ChapterListApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=chapter-response.dto.js.map