import { Model } from 'mongoose';
import { OrganizationModuleDocument } from '../schemas/organization-module.schema';
export declare class OrganizationModuleRepository {
    private model;
    constructor(model: Model<OrganizationModuleDocument>);
    findEnabledByOrg(organizationId: string): Promise<OrganizationModuleDocument[]>;
    findAllByOrg(organizationId: string): Promise<OrganizationModuleDocument[]>;
    disable(organizationId: string, moduleKey: string): Promise<OrganizationModuleDocument | null>;
    enable(organizationId: string, moduleKey: string, enabledByUserId: string): Promise<OrganizationModuleDocument>;
    isEnabled(organizationId: string, moduleKey: string): Promise<boolean>;
    deleteByOrg(organizationId: string): Promise<number>;
}
