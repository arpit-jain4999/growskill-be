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
exports.CohortListResponseDto = exports.CohortResponseDto = exports.CohortIconDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FileInfoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'File ID' }),
    __metadata("design:type", String)
], FileInfoDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohort-icon.png', description: 'File name' }),
    __metadata("design:type", String)
], FileInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'File key/path' }),
    __metadata("design:type", String)
], FileInfoDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com', description: 'Base URL' }),
    __metadata("design:type", String)
], FileInfoDto.prototype, "baseUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'Complete image URL' }),
    __metadata("design:type", String)
], FileInfoDto.prototype, "imgUrl", void 0);
class CohortIconDto {
}
exports.CohortIconDto = CohortIconDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FileInfoDto }),
    __metadata("design:type", FileInfoDto)
], CohortIconDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FileInfoDto }),
    __metadata("design:type", FileInfoDto)
], CohortIconDto.prototype, "web", void 0);
class CohortResponseDto {
}
exports.CohortResponseDto = CohortResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Cohort ID' }),
    __metadata("design:type", String)
], CohortResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Web Development Cohort', description: 'Cohort name' }),
    __metadata("design:type", String)
], CohortResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CohortIconDto }),
    __metadata("design:type", CohortIconDto)
], CohortResponseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Display order' }),
    __metadata("design:type", Number)
], CohortResponseDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IN', description: 'Country code' }),
    __metadata("design:type", String)
], CohortResponseDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Visible on home page' }),
    __metadata("design:type", Boolean)
], CohortResponseDto.prototype, "isVisibleOnHomePage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Learn web development from scratch', description: 'Cohort description' }),
    __metadata("design:type", String)
], CohortResponseDto.prototype, "description", void 0);
class CohortListResponseDto {
}
exports.CohortListResponseDto = CohortListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CohortResponseDto] }),
    __metadata("design:type", Array)
], CohortListResponseDto.prototype, "cohorts", void 0);
//# sourceMappingURL=cohort-response.dto.js.map