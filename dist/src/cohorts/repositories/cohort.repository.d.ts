import { Model } from 'mongoose';
import { Cohort, CohortDocument } from '../schemas/cohort.schema';
export declare class CohortRepository {
    private cohortModel;
    constructor(cohortModel: Model<CohortDocument>);
    findAll(organizationId: string): Promise<CohortDocument[]>;
    findAllForAdmin(organizationId: string): Promise<CohortDocument[]>;
    findById(id: string, organizationId?: string): Promise<CohortDocument | null>;
    create(cohortData: Partial<Cohort>): Promise<CohortDocument>;
    update(id: string, organizationId: string, updateData: Partial<Cohort>): Promise<CohortDocument | null>;
    softDelete(id: string, organizationId: string): Promise<CohortDocument | null>;
}
