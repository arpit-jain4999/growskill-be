import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrgPermissionRepository } from './repositories/org-permission.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Actor } from '../common/types/actor';
import { ROLES } from '../common/constants/roles';
import {
  ALL_PERMISSIONS,
  MODULE_PERMISSIONS,
  MODULE_READ_PERMISSION,
} from '../common/constants/permissions';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class PermissionsService {
  constructor(
    private orgPermRepo: OrgPermissionRepository,
    private userPermRepo: UserPermissionRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private logger: LoggerService,
  ) {
    this.logger.setContext('PermissionsService');
  }

  // ─── Org-level permission queries ───────────────────────────

  async getOrgPermissions(organizationId: string): Promise<string[]> {
    return this.orgPermRepo.findKeysByOrg(organizationId);
  }

  /**
   * Delete all org-level and user-level permissions for an organization.
   * Used when deleting an organization (cascade).
   */
  async deleteAllForOrganization(organizationId: string): Promise<void> {
    await this.orgPermRepo.deleteAllByOrg(organizationId);
    await this.userPermRepo.deleteAllByOrg(organizationId);
    this.logger.log(`Deleted all permissions for org ${organizationId}`);
  }

  /**
   * Sync OrgPermission rows when a feature module is enabled/disabled.
   * Called by OrganizationsService.enableModule / disableModule.
   */
  async syncOrgPermissionsForModule(
    organizationId: string,
    moduleKey: string,
    enable: boolean,
    userId: string,
  ): Promise<void> {
    const perms = MODULE_PERMISSIONS[moduleKey];
    if (!perms || perms.length === 0) return;

    if (enable) {
      await this.orgPermRepo.bulkInsert(organizationId, perms, userId);
      this.logger.log(`Synced org permissions: enabled ${moduleKey} → +${perms.length} keys for org ${organizationId}`);
    } else {
      await this.orgPermRepo.bulkRemove(organizationId, perms);
      this.logger.log(`Synced org permissions: disabled ${moduleKey} → -${perms.length} keys for org ${organizationId}`);
    }
  }

  // ─── User-level permission queries ──────────────────────────

  async getUserAssignedPermissions(organizationId: string, userId: string): Promise<string[]> {
    return this.userPermRepo.findKeysByUser(organizationId, userId);
  }

  /**
   * Effective permissions = assigned user grants + role-based auto-grants.
   * - PLATFORM_OWNER: ['*']
   * - SUPER_ADMIN: all org-level permissions
   * - ADMIN / USER: assigned grants + read permissions for org's enabled modules
   */
  async getEffectivePermissions(actor: Actor): Promise<string[]> {
    if (actor.role === ROLES.PLATFORM_OWNER) {
      return ['*'];
    }
    if (!actor.organizationId) {
      return [];
    }

    const orgId = actor.organizationId;

    if (actor.role === ROLES.SUPER_ADMIN) {
      const orgPerms = await this.orgPermRepo.findKeysByOrg(orgId);
      const assigned = await this.userPermRepo.findKeysByUser(orgId, actor.userId);
      const merged = new Set([...orgPerms, ...assigned]);
      return Array.from(merged);
    }

    const assigned = await this.userPermRepo.findKeysByUser(orgId, actor.userId);
    const effective = new Set(assigned);

    const orgPerms = await this.orgPermRepo.findKeysByOrg(orgId);
    const readValues = new Set(Object.values(MODULE_READ_PERMISSION));
    for (const key of orgPerms) {
      if (readValues.has(key)) {
        effective.add(key);
      }
    }

    return Array.from(effective);
  }

  async hasPermission(actor: Actor, permission: string): Promise<boolean> {
    if (actor.role === ROLES.PLATFORM_OWNER) return true;
    const effective = await this.getEffectivePermissions(actor);
    if (effective.includes('*')) return true;
    return effective.includes(permission);
  }

  // ─── Grant / Revoke / Set ───────────────────────────────────

  private validatePermissionKeys(keys: string[]): void {
    const invalid = keys.filter((k) => !ALL_PERMISSIONS.includes(k));
    if (invalid.length > 0) {
      throw new BadRequestException(`Unknown permission keys: ${invalid.join(', ')}`);
    }
  }

  private async resolveOrgUser(userId: string, actorOrgId: string): Promise<UserDocument> {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.organizationId?.toString() !== actorOrgId) {
      throw new ForbiddenException('User does not belong to your organisation');
    }
    return user;
  }

  async getUserPermissions(userId: string, actorOrgId: string) {
    const user = await this.resolveOrgUser(userId, actorOrgId);
    const assigned = await this.userPermRepo.findKeysByUser(actorOrgId, userId);
    const actor: Actor = {
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

  async grantToUser(
    organizationId: string,
    userId: string,
    permissions: string[],
    grantedBy: string,
  ) {
    this.validatePermissionKeys(permissions);
    await this.resolveOrgUser(userId, organizationId);

    const orgPerms = await this.orgPermRepo.findKeysByOrg(organizationId);
    const unavailable = permissions.filter((p) => !orgPerms.includes(p));
    if (unavailable.length > 0) {
      throw new BadRequestException(
        `Permissions not available for this organisation: ${unavailable.join(', ')}. Enable the relevant module first.`,
      );
    }

    await this.userPermRepo.grant(organizationId, userId, permissions, grantedBy);
    this.logger.log(`Granted [${permissions.join(', ')}] to user ${userId} in org ${organizationId}`);
    return this.getUserPermissions(userId, organizationId);
  }

  async revokeFromUser(
    organizationId: string,
    userId: string,
    permissions: string[],
  ) {
    this.validatePermissionKeys(permissions);
    await this.resolveOrgUser(userId, organizationId);
    await this.userPermRepo.revoke(organizationId, userId, permissions);
    this.logger.log(`Revoked [${permissions.join(', ')}] from user ${userId} in org ${organizationId}`);
    return this.getUserPermissions(userId, organizationId);
  }

  async setUserPermissions(
    organizationId: string,
    userId: string,
    permissions: string[],
    grantedBy: string,
  ) {
    this.validatePermissionKeys(permissions);
    await this.resolveOrgUser(userId, organizationId);

    if (permissions.length > 0) {
      const orgPerms = await this.orgPermRepo.findKeysByOrg(organizationId);
      const unavailable = permissions.filter((p) => !orgPerms.includes(p));
      if (unavailable.length > 0) {
        throw new BadRequestException(
          `Permissions not available for this organisation: ${unavailable.join(', ')}. Enable the relevant module first.`,
        );
      }
    }

    await this.userPermRepo.replaceAll(organizationId, userId, permissions, grantedBy);
    this.logger.log(`Set permissions for user ${userId} in org ${organizationId} to [${permissions.join(', ')}]`);
    return this.getUserPermissions(userId, organizationId);
  }
}
