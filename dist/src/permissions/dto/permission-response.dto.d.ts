export declare class PermissionInfoDto {
    key: string;
    group: string;
    label: string;
}
export declare class UserPermissionsResponseDto {
    userId: string;
    role: string;
    assignedPermissions: string[];
    effectivePermissions: string[];
}
export declare class AvailablePermissionsResponseDto {
    success: boolean;
    data: PermissionInfoDto[];
}
export declare class UserPermissionsApiResponseDto {
    success: boolean;
    data: UserPermissionsResponseDto;
}
export declare class PermissionUpdateResponseDto {
    success: boolean;
    data: UserPermissionsResponseDto;
}
