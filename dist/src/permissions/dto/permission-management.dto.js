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
exports.SetPermissionsDto = exports.RevokePermissionsDto = exports.GrantPermissionsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GrantPermissionsDto {
}
exports.GrantPermissionsDto = GrantPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GrantPermissionsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['course:create', 'course:update', 'module:read'],
        description: 'Permission keys to grant (added to existing permissions)',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GrantPermissionsDto.prototype, "permissions", void 0);
class RevokePermissionsDto {
}
exports.RevokePermissionsDto = RevokePermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RevokePermissionsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['course:create'],
        description: 'Permission keys to revoke (removed from existing permissions)',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RevokePermissionsDto.prototype, "permissions", void 0);
class SetPermissionsDto {
}
exports.SetPermissionsDto = SetPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetPermissionsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['course:read', 'module:read', 'chapter:read'],
        description: 'Complete set of permission keys — replaces all existing permissions',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SetPermissionsDto.prototype, "permissions", void 0);
//# sourceMappingURL=permission-management.dto.js.map