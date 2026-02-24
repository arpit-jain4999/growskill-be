export declare const ROLES: {
    readonly PLATFORM_OWNER: "PLATFORM_OWNER";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare const ORG_ROLES: Role[];
export declare function isPlatformOwner(role: string): boolean;
export declare function isSuperAdmin(role: string): boolean;
export declare function isOrgRole(role: string): boolean;
