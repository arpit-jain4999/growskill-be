import { Model } from 'mongoose';
import { OrgPermissionDocument } from '../schemas/org-permission.schema';
export declare class OrgPermissionRepository {
    private model;
    constructor(model: Model<OrgPermissionDocument>);
    findByOrg(organizationId: string): Promise<OrgPermissionDocument[]>;
    findKeysByOrg(organizationId: string): Promise<string[]>;
    hasKey(organizationId: string, permissionKey: string): Promise<boolean>;
    bulkInsert(organizationId: string, permissionKeys: string[], grantedBy: string): Promise<number>;
    bulkRemove(organizationId: string, permissionKeys: string[]): Promise<number>;
}
