import { PermissionsService } from './permissions.service';
import { GrantPermissionsDto, RevokePermissionsDto, SetPermissionsDto } from './dto/permission-management.dto';
import { Actor } from '../common/types/actor';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class AdminPermissionsController {
    private readonly permissionsService;
    private readonly organizationsService;
    constructor(permissionsService: PermissionsService, organizationsService: OrganizationsService);
    private resolveOrgId;
    listAvailable(): Promise<import("../common/constants/permission-meta").PermissionMeta[]>;
    listOrgPermissions(actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<{
        permissions: string[];
    }>;
    getUserPermissions(userId: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    grant(dto: GrantPermissionsDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    revoke(dto: RevokePermissionsDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    setPermissions(dto: SetPermissionsDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
}
