import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../schemas/organization.schema';
export declare class OrganizationRepository {
    private orgModel;
    constructor(orgModel: Model<OrganizationDocument>);
    create(data: Partial<Organization>): Promise<OrganizationDocument>;
    findAll(): Promise<OrganizationDocument[]>;
    findById(id: string): Promise<OrganizationDocument | null>;
    update(id: string, data: Partial<Organization>): Promise<OrganizationDocument | null>;
}
