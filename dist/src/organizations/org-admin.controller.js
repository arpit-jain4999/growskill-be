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
exports.OrgAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const tenant_context_guard_2 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const assert_same_org_1 = require("../common/helpers/assert-same-org");
const roles_1 = require("../common/constants/roles");
const permissions_1 = require("../common/constants/permissions");
const phone_1 = require("../common/helpers/phone");
const user_schema_1 = require("../auth/schemas/user.schema");
const organizations_service_1 = require("./organizations.service");
const permissions_service_1 = require("../permissions/permissions.service");
let OrgAdminController = class OrgAdminController {
    constructor(userModel, organizationsService, permissionsService) {
        this.userModel = userModel;
        this.organizationsService = organizationsService;
        this.permissionsService = permissionsService;
    }
    async listUsers(actor) {
        const allowed = [roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.ADMIN, roles_1.ROLES.PLATFORM_OWNER];
        if (!allowed.includes(actor.role)) {
            throw new common_1.ForbiddenException('Only SUPER_ADMIN, ADMIN, or PLATFORM_OWNER can list users');
        }
        return this.organizationsService.findUsersByOrg(actor.organizationId);
    }
    async createUser(body, actor) {
        const organizationId = actor.organizationId;
        const user = await this.userModel.create({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            email: body.email,
            name: body.name,
            countryCode: (0, phone_1.normalizeCountryCode)(body.countryCode),
            phoneNumber: (0, phone_1.normalizePhoneNumber)(body.phoneNumber),
            role: roles_1.ROLES.USER,
            isVerified: false,
        });
        return user;
    }
    async setUserRole(userId, body, actor) {
        const target = await this.userModel.findById(userId);
        if (!target)
            throw new common_1.ForbiddenException('User not found');
        (0, assert_same_org_1.assertSameOrg)(target.organizationId?.toString(), actor.organizationId);
        if (body.role === roles_1.ROLES.ADMIN) {
            if (actor.role !== roles_1.ROLES.SUPER_ADMIN) {
                throw new common_1.ForbiddenException('Only SUPER_ADMIN can assign ADMIN role');
            }
        }
        else if (body.role === roles_1.ROLES.SUPER_ADMIN) {
            const existing = await this.userModel.findOne({
                organizationId: target.organizationId,
                role: roles_1.ROLES.SUPER_ADMIN,
            });
            if (existing && existing._id.toString() !== userId) {
                throw new common_1.ForbiddenException('Organization already has a SUPER_ADMIN');
            }
        }
        target.role = body.role;
        await target.save();
        return target;
    }
    async grantPermission(body, actor) {
        return this.permissionsService.grantToUser(actor.organizationId, body.userId, body.permissions, actor.userId);
    }
    async enableModule(body, actor) {
        if (actor.role !== roles_1.ROLES.SUPER_ADMIN && actor.role !== roles_1.ROLES.PLATFORM_OWNER) {
            throw new common_1.ForbiddenException('SUPER_ADMIN or PLATFORM_OWNER required');
        }
        const orgId = actor.organizationId;
        await this.organizationsService.enableModule(orgId, body.moduleKey, actor.userId);
        return { enabled: body.moduleKey };
    }
    async listModules(actor) {
        const orgId = actor.organizationId;
        const keys = await this.organizationsService.getEnabledModules(orgId);
        return { modules: keys };
    }
};
exports.OrgAdminController = OrgAdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List users in current org (SUPER_ADMIN, ADMIN, or PLATFORM_OWNER)' }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.USER_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Create user in org' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:userId/role'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.USER_ASSIGN_ROLE_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Promote/demote user role (SUPER_ADMIN only for ADMIN)' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "setUserRole", null);
__decorate([
    (0, common_1.Post)('permissions/grant'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.PERMISSION_GRANT),
    (0, swagger_1.ApiOperation)({ summary: 'Grant permissions to user (delegates to PermissionsService)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "grantPermission", null);
__decorate([
    (0, common_1.Post)('modules/enable'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable module for org (SUPER_ADMIN or PLATFORM_OWNER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "enableModule", null);
__decorate([
    (0, common_1.Get)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'List enabled modules for current org' }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrgAdminController.prototype, "listModules", null);
exports.OrgAdminController = OrgAdminController = __decorate([
    (0, swagger_1.ApiTags)('Org Admin'),
    (0, common_1.Controller)('v1/org'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_2.RequireTenantGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        organizations_service_1.OrganizationsService,
        permissions_service_1.PermissionsService])
], OrgAdminController);
//# sourceMappingURL=org-admin.controller.js.map