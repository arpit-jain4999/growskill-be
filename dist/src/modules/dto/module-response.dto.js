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
exports.ModuleListApiResponseDto = exports.ModuleApiResponseDto = exports.ModuleResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ModuleResponseDto {
}
exports.ModuleResponseDto = ModuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Module ID', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439020', description: 'Organization ID the module belongs to', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Introduction to JavaScript', description: 'Module title', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Covers JS basics: variables, functions, and control flow', description: 'Module description', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '507f1f77bcf86cd799439015', description: 'Course ID this module belongs to (null if standalone)', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Display order within the course (0-based)', type: Number }),
    __metadata("design:type", Number)
], ModuleResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the module is active / visible', type: Boolean }),
    __metadata("design:type", Boolean)
], ModuleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:00:00.000Z', description: 'Creation timestamp', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-20T14:30:00.000Z', description: 'Last update timestamp', type: String }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "updatedAt", void 0);
class ModuleApiResponseDto {
}
exports.ModuleApiResponseDto = ModuleApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates the request succeeded', type: Boolean }),
    __metadata("design:type", Boolean)
], ModuleApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The module object', type: ModuleResponseDto }),
    __metadata("design:type", ModuleResponseDto)
], ModuleApiResponseDto.prototype, "data", void 0);
class ModuleListApiResponseDto {
}
exports.ModuleListApiResponseDto = ModuleListApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates the request succeeded', type: Boolean }),
    __metadata("design:type", Boolean)
], ModuleListApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of modules', type: () => ModuleResponseDto, isArray: true }),
    __metadata("design:type", Array)
], ModuleListApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=module-response.dto.js.map