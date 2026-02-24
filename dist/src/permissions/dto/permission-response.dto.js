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
exports.PermissionUpdateResponseDto = exports.UserPermissionsApiResponseDto = exports.AvailablePermissionsResponseDto = exports.UserPermissionsResponseDto = exports.PermissionInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PermissionInfoDto {
}
exports.PermissionInfoDto = PermissionInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'course:create', description: 'Permission key' }),
    __metadata("design:type", String)
], PermissionInfoDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Course', description: 'Resource group the permission belongs to' }),
    __metadata("design:type", String)
], PermissionInfoDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Create courses', description: 'Human-readable description' }),
    __metadata("design:type", String)
], PermissionInfoDto.prototype, "label", void 0);
class UserPermissionsResponseDto {
}
exports.UserPermissionsResponseDto = UserPermissionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'User ID' }),
    __metadata("design:type", String)
], UserPermissionsResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USER', description: 'User role' }),
    __metadata("design:type", String)
], UserPermissionsResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['course:read', 'module:read'],
        description: 'Permissions explicitly assigned to this user',
        type: [String],
    }),
    __metadata("design:type", Array)
], UserPermissionsResponseDto.prototype, "assignedPermissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['course:read', 'module:read', 'chapter:read', 'cohort:read'],
        description: 'Effective permissions (assigned + role-based auto-grants)',
        type: [String],
    }),
    __metadata("design:type", Array)
], UserPermissionsResponseDto.prototype, "effectivePermissions", void 0);
class AvailablePermissionsResponseDto {
}
exports.AvailablePermissionsResponseDto = AvailablePermissionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, type: Boolean }),
    __metadata("design:type", Boolean)
], AvailablePermissionsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'All grantable permissions grouped by resource', type: () => PermissionInfoDto, isArray: true }),
    __metadata("design:type", Array)
], AvailablePermissionsResponseDto.prototype, "data", void 0);
class UserPermissionsApiResponseDto {
}
exports.UserPermissionsApiResponseDto = UserPermissionsApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, type: Boolean }),
    __metadata("design:type", Boolean)
], UserPermissionsApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserPermissionsResponseDto }),
    __metadata("design:type", UserPermissionsResponseDto)
], UserPermissionsApiResponseDto.prototype, "data", void 0);
class PermissionUpdateResponseDto {
}
exports.PermissionUpdateResponseDto = PermissionUpdateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, type: Boolean }),
    __metadata("design:type", Boolean)
], PermissionUpdateResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated user permissions', type: UserPermissionsResponseDto }),
    __metadata("design:type", UserPermissionsResponseDto)
], PermissionUpdateResponseDto.prototype, "data", void 0);
//# sourceMappingURL=permission-response.dto.js.map