export interface Actor {
    userId: string;
    organizationId: string | null;
    role: string;
    permissions: string[];
    countryCode?: string;
    phoneNumber?: string;
}
export declare function hasPermission(actor: Actor, permission: string): boolean;
export declare function isInOrg(actor: Actor): boolean;
