import { Model } from 'mongoose';
import { UserPermissionDocument } from '../schemas/user-permission.schema';
export declare class UserPermissionRepository {
    private model;
    constructor(model: Model<UserPermissionDocument>);
    findByUser(organizationId: string, userId: string): Promise<UserPermissionDocument[]>;
    findKeysByUser(organizationId: string, userId: string): Promise<string[]>;
    grant(organizationId: string, userId: string, permissionKeys: string[], grantedBy: string): Promise<number>;
    revoke(organizationId: string, userId: string, permissionKeys: string[]): Promise<number>;
    replaceAll(organizationId: string, userId: string, permissionKeys: string[], grantedBy: string): Promise<void>;
    deleteAllByOrg(organizationId: string): Promise<number>;
}
