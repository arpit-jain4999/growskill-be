import { PermissionsService } from './permissions.service';
import { GrantPermissionsDto, RevokePermissionsDto, SetPermissionsDto } from './dto/permission-management.dto';
import { Actor } from '../common/types/actor';
export declare class AdminPermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    listAvailable(): Promise<import("../common/constants/permission-meta").PermissionMeta[]>;
    listOrgPermissions(actor: Actor): Promise<{
        permissions: string[];
    }>;
    getUserPermissions(userId: string, actor: Actor): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    grant(dto: GrantPermissionsDto, actor: Actor): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    revoke(dto: RevokePermissionsDto, actor: Actor): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    setPermissions(dto: SetPermissionsDto, actor: Actor): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
}
