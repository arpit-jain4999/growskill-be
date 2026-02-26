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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const permission_management_dto_1 = require("./dto/permission-management.dto");
const permission_response_dto_1 = require("./dto/permission-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
const permission_meta_1 = require("../common/constants/permission-meta");
const roles_1 = require("../common/constants/roles");
const organizations_service_1 = require("../organizations/organizations.service");
let AdminPermissionsController = class AdminPermissionsController {
    constructor(permissionsService, organizationsService) {
        this.permissionsService = permissionsService;
        this.organizationsService = organizationsService;
    }
    async resolveOrgId(actor, request) {
        let orgId = actor.organizationId ?? null;
        if (!orgId && actor.role === roles_1.ROLES.PLATFORM_OWNER && request?.headers) {
            const raw = request.headers['x-org-id'] ?? request.headers['X-Org-Id'];
            const trimmed = typeof raw === 'string' ? raw.trim() : '';
            if (trimmed) {
                await this.organizationsService.findById(trimmed);
                orgId = trimmed;
            }
        }
        if (!orgId) {
            throw new common_1.BadRequestException('x-org-id header required for this operation');
        }
        return orgId;
    }
    async listAvailable() {
        return permission_meta_1.PERMISSION_META;
    }
    async listOrgPermissions(actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        const keys = await this.permissionsService.getOrgPermissions(orgId);
        return { permissions: keys };
    }
    async getUserPermissions(userId, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.permissionsService.getUserPermissions(userId, orgId);
    }
    async grant(dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.permissionsService.grantToUser(orgId, dto.userId, dto.permissions, actor.userId);
    }
    async revoke(dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.permissionsService.revokeFromUser(orgId, dto.userId, dto.permissions);
    }
    async setPermissions(dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.permissionsService.setUserPermissions(orgId, dto.userId, dto.permissions, actor.userId);
    }
};
exports.AdminPermissionsController = AdminPermissionsController;
__decorate([
    (0, common_1.Get)('available'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'List all grantable permissions',
        description: 'Returns every permission key with its group and human-readable label. Use this to build a permissions picker UI.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all permissions', type: permission_response_dto_1.AvailablePermissionsResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission:grant permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "listAvailable", null);
__decorate([
    (0, common_1.Get)('org'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'List permissions available for this organisation',
        description: 'Returns permission keys that have been enabled for the current org (based on enabled modules).',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Org-level permission keys' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "listOrgPermissions", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user\'s permissions',
        description: 'Returns both the explicitly assigned permissions and the effective permissions (which include role-based auto-grants).',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'Target user ID', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User permissions', type: permission_response_dto_1.UserPermissionsApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user ID', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not in your organisation or missing permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Post)('grant'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'Grant permissions to a user',
        description: 'Adds the specified permission keys to the user. Only permissions available for this org (enabled modules) can be granted.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Permissions granted. Returns updated permissions.', type: permission_response_dto_1.PermissionUpdateResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user ID or unknown/unavailable permission keys', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not in your organisation or missing permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_management_dto_1.GrantPermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "grant", null);
__decorate([
    (0, common_1.Post)('revoke'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'Revoke permissions from a user',
        description: 'Removes the specified permission keys from the user. Other permissions are preserved.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Permissions revoked. Returns updated permissions.', type: permission_response_dto_1.PermissionUpdateResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user ID or unknown permission keys', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not in your organisation or missing permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_management_dto_1.RevokePermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "revoke", null);
__decorate([
    (0, common_1.Post)('set'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({
        summary: 'Set (replace) a user\'s permissions',
        description: 'Replaces the user\'s entire permission set with the provided list. Pass an empty array to clear all. Only org-available permissions can be set.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Permissions replaced. Returns updated permissions.', type: permission_response_dto_1.PermissionUpdateResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid user ID or unknown/unavailable permission keys', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not in your organisation or missing permission', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_management_dto_1.SetPermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionsController.prototype, "setPermissions", null);
exports.AdminPermissionsController = AdminPermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Admin – Permissions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiExtraModels)(permission_response_dto_1.PermissionInfoDto, permission_response_dto_1.AvailablePermissionsResponseDto, permission_response_dto_1.UserPermissionsApiResponseDto, permission_response_dto_1.PermissionUpdateResponseDto, permission_management_dto_1.GrantPermissionsDto, permission_management_dto_1.RevokePermissionsDto, permission_management_dto_1.SetPermissionsDto),
    (0, common_1.Controller)('v1/admin/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService,
        organizations_service_1.OrganizationsService])
], AdminPermissionsController);
//# sourceMappingURL=admin-permissions.controller.js.map