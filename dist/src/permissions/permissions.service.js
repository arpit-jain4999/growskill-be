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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const org_permission_repository_1 = require("./repositories/org-permission.repository");
const user_permission_repository_1 = require("./repositories/user-permission.repository");
const user_schema_1 = require("../auth/schemas/user.schema");
const roles_1 = require("../common/constants/roles");
const permissions_1 = require("../common/constants/permissions");
const logger_service_1 = require("../common/services/logger.service");
let PermissionsService = class PermissionsService {
    constructor(orgPermRepo, userPermRepo, userModel, logger) {
        this.orgPermRepo = orgPermRepo;
        this.userPermRepo = userPermRepo;
        this.userModel = userModel;
        this.logger = logger;
        this.logger.setContext('PermissionsService');
    }
    async getOrgPermissions(organizationId) {
        return this.orgPermRepo.findKeysByOrg(organizationId);
    }
    async deleteAllForOrganization(organizationId) {
        await this.orgPermRepo.deleteAllByOrg(organizationId);
        await this.userPermRepo.deleteAllByOrg(organizationId);
        this.logger.log(`Deleted all permissions for org ${organizationId}`);
    }
    async syncOrgPermissionsForModule(organizationId, moduleKey, enable, userId) {
        const perms = permissions_1.MODULE_PERMISSIONS[moduleKey];
        if (!perms || perms.length === 0)
            return;
        if (enable) {
            await this.orgPermRepo.bulkInsert(organizationId, perms, userId);
            this.logger.log(`Synced org permissions: enabled ${moduleKey} → +${perms.length} keys for org ${organizationId}`);
        }
        else {
            await this.orgPermRepo.bulkRemove(organizationId, perms);
            this.logger.log(`Synced org permissions: disabled ${moduleKey} → -${perms.length} keys for org ${organizationId}`);
        }
    }
    async getUserAssignedPermissions(organizationId, userId) {
        return this.userPermRepo.findKeysByUser(organizationId, userId);
    }
    async getEffectivePermissions(actor) {
        if (actor.role === roles_1.ROLES.PLATFORM_OWNER) {
            return ['*'];
        }
        if (!actor.organizationId) {
            return [];
        }
        const orgId = actor.organizationId;
        if (actor.role === roles_1.ROLES.SUPER_ADMIN) {
            const orgPerms = await this.orgPermRepo.findKeysByOrg(orgId);
            const assigned = await this.userPermRepo.findKeysByUser(orgId, actor.userId);
            const merged = new Set([...orgPerms, ...assigned]);
            return Array.from(merged);
        }
        const assigned = await this.userPermRepo.findKeysByUser(orgId, actor.userId);
        const effective = new Set(assigned);
        const orgPerms = await this.orgPermRepo.findKeysByOrg(orgId);
        const readValues = new Set(Object.values(permissions_1.MODULE_READ_PERMISSION));
        for (const key of orgPerms) {
            if (readValues.has(key)) {
                effective.add(key);
            }
        }
        return Array.from(effective);
    }
    async hasPermission(actor, permission) {
        if (actor.role === roles_1.ROLES.PLATFORM_OWNER)
            return true;
        const effective = await this.getEffectivePermissions(actor);
        if (effective.includes('*'))
            return true;
        return effective.includes(permission);
    }
    validatePermissionKeys(keys) {
        const invalid = keys.filter((k) => !permissions_1.ALL_PERMISSIONS.includes(k));
        if (invalid.length > 0) {
            throw new common_1.BadRequestException(`Unknown permission keys: ${invalid.join(', ')}`);
        }
    }
    async resolveOrgUser(userId, actorOrgId) {
        if (!userId || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.organizationId?.toString() !== actorOrgId) {
            throw new common_1.ForbiddenException('User does not belong to your organisation');
        }
        return user;
    }
    async getUserPermissions(userId, actorOrgId) {
        const user = await this.resolveOrgUser(userId, actorOrgId);
        const assigned = await this.userPermRepo.findKeysByUser(actorOrgId, userId);
        const actor = {
            userId: user._id.toString(),
            organizationId: user.organizationId?.toString() ?? null,
            role: user.role,
            permissions: [],
        };
        const effective = await this.getEffectivePermissions(actor);
        return {
            userId: user._id.toString(),
            role: user.role,
            assignedPermissions: assigned,
            effectivePermissions: effective,
        };
    }
    async grantToUser(organizationId, userId, permissions, grantedBy) {
        this.validatePermissionKeys(permissions);
        await this.resolveOrgUser(userId, organizationId);
        const orgPerms = await this.orgPermRepo.findKeysByOrg(organizationId);
        const unavailable = permissions.filter((p) => !orgPerms.includes(p));
        if (unavailable.length > 0) {
            throw new common_1.BadRequestException(`Permissions not available for this organisation: ${unavailable.join(', ')}. Enable the relevant module first.`);
        }
        await this.userPermRepo.grant(organizationId, userId, permissions, grantedBy);
        this.logger.log(`Granted [${permissions.join(', ')}] to user ${userId} in org ${organizationId}`);
        return this.getUserPermissions(userId, organizationId);
    }
    async revokeFromUser(organizationId, userId, permissions) {
        this.validatePermissionKeys(permissions);
        await this.resolveOrgUser(userId, organizationId);
        await this.userPermRepo.revoke(organizationId, userId, permissions);
        this.logger.log(`Revoked [${permissions.join(', ')}] from user ${userId} in org ${organizationId}`);
        return this.getUserPermissions(userId, organizationId);
    }
    async setUserPermissions(organizationId, userId, permissions, grantedBy) {
        this.validatePermissionKeys(permissions);
        await this.resolveOrgUser(userId, organizationId);
        if (permissions.length > 0) {
            const orgPerms = await this.orgPermRepo.findKeysByOrg(organizationId);
            const unavailable = permissions.filter((p) => !orgPerms.includes(p));
            if (unavailable.length > 0) {
                throw new common_1.BadRequestException(`Permissions not available for this organisation: ${unavailable.join(', ')}. Enable the relevant module first.`);
            }
        }
        await this.userPermRepo.replaceAll(organizationId, userId, permissions, grantedBy);
        this.logger.log(`Set permissions for user ${userId} in org ${organizationId} to [${permissions.join(', ')}]`);
        return this.getUserPermissions(userId, organizationId);
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [org_permission_repository_1.OrgPermissionRepository,
        user_permission_repository_1.UserPermissionRepository,
        mongoose_2.Model,
        logger_service_1.LoggerService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map