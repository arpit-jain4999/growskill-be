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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const roles_1 = require("../common/constants/roles");
const organizations_service_1 = require("./organizations.service");
const create_organization_dto_1 = require("./dto/create-organization.dto");
let PlatformController = class PlatformController {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    ensurePlatformOwner(actor) {
        if (actor.role !== roles_1.ROLES.PLATFORM_OWNER) {
            throw new common_1.ForbiddenException('Platform owner access required');
        }
    }
    async create(dto, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.create(dto);
    }
    async createWithSuperAdmin(body, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.createWithSuperAdmin(body.organization, body.superAdmin);
    }
    async list(actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.findAll();
    }
    getModuleKeys(actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.getAvailableModuleKeys();
    }
    async get(orgId, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.findById(orgId);
    }
    async getOrgUsers(orgId, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.findUsersByOrg(orgId);
    }
    async getOrgModules(orgId, actor) {
        this.ensurePlatformOwner(actor);
        await this.organizationsService.findById(orgId);
        return this.organizationsService.getModulesForOrg(orgId);
    }
    async enableOrgModule(orgId, moduleKey, actor) {
        this.ensurePlatformOwner(actor);
        await this.organizationsService.findById(orgId);
        await this.organizationsService.enableModule(orgId, moduleKey, actor.userId);
        return { enabled: moduleKey };
    }
    async disableOrgModule(orgId, moduleKey, actor) {
        this.ensurePlatformOwner(actor);
        await this.organizationsService.findById(orgId);
        await this.organizationsService.disableModule(orgId, moduleKey);
        return { disabled: moduleKey };
    }
    async setUserRole(orgId, userId, body, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.setUserRoleByPlatform(orgId, userId, body.role);
    }
    async update(orgId, dto, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.update(orgId, dto);
    }
    async assignSuperAdmin(orgId, dto, actor) {
        this.ensurePlatformOwner(actor);
        return this.organizationsService.assignInitialSuperAdmin(orgId, dto);
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create organization' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('with-super-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create organization and assign initial SUPER_ADMIN' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "createWithSuperAdmin", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all organizations' }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('module-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'List available feature modules and their permissions (for dashboard)' }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "getModuleKeys", null);
__decorate([
    (0, common_1.Get)(':orgId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization by ID' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(':orgId/users'),
    (0, swagger_1.ApiOperation)({ summary: 'List users in an organisation (for PLATFORM_OWNER dashboard)' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getOrgUsers", null);
__decorate([
    (0, common_1.Get)(':orgId/modules'),
    (0, swagger_1.ApiOperation)({ summary: 'List feature modules and their enabled state for an organisation' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getOrgModules", null);
__decorate([
    (0, common_1.Post)(':orgId/modules/:moduleKey/enable'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable a feature module for an organisation (grants permissions to SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Param)('moduleKey')),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "enableOrgModule", null);
__decorate([
    (0, common_1.Post)(':orgId/modules/:moduleKey/disable'),
    (0, swagger_1.ApiOperation)({ summary: 'Disable a feature module for an organisation' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Param)('moduleKey')),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "disableOrgModule", null);
__decorate([
    (0, common_1.Patch)(':orgId/users/:userId/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Set user role in organisation (e.g. promote to SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "setUserRole", null);
__decorate([
    (0, common_1.Patch)(':orgId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':orgId/super-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign initial SUPER_ADMIN to organization' }),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_organization_dto_1.AssignSuperAdminDto, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "assignSuperAdmin", null);
exports.PlatformController = PlatformController = __decorate([
    (0, swagger_1.ApiTags)('Platform'),
    (0, common_1.Controller)('v1/platform/orgs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], PlatformController);
//# sourceMappingURL=platform.controller.js.map