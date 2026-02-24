import { Model } from 'mongoose';
import { OrgPermissionRepository } from './repositories/org-permission.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { UserDocument } from '../auth/schemas/user.schema';
import { Actor } from '../common/types/actor';
import { LoggerService } from '../common/services/logger.service';
export declare class PermissionsService {
    private orgPermRepo;
    private userPermRepo;
    private userModel;
    private logger;
    constructor(orgPermRepo: OrgPermissionRepository, userPermRepo: UserPermissionRepository, userModel: Model<UserDocument>, logger: LoggerService);
    getOrgPermissions(organizationId: string): Promise<string[]>;
    syncOrgPermissionsForModule(organizationId: string, moduleKey: string, enable: boolean, userId: string): Promise<void>;
    getUserAssignedPermissions(organizationId: string, userId: string): Promise<string[]>;
    getEffectivePermissions(actor: Actor): Promise<string[]>;
    hasPermission(actor: Actor, permission: string): Promise<boolean>;
    private validatePermissionKeys;
    private resolveOrgUser;
    getUserPermissions(userId: string, actorOrgId: string): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    grantToUser(organizationId: string, userId: string, permissions: string[], grantedBy: string): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    revokeFromUser(organizationId: string, userId: string, permissions: string[]): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    setUserPermissions(organizationId: string, userId: string, permissions: string[], grantedBy: string): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
}
