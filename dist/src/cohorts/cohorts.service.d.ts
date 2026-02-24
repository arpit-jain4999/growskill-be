import { CohortRepository } from './repositories/cohort.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
export declare class CohortsService {
    private cohortRepository;
    private logger;
    constructor(cohortRepository: CohortRepository, logger: LoggerService);
    findAll(organizationId: string): Promise<import("./schemas/cohort.schema").CohortDocument[]>;
    findAllForAdmin(organizationId: string): Promise<import("./schemas/cohort.schema").CohortDocument[]>;
    findById(id: string, organizationId: string): Promise<import("./schemas/cohort.schema").CohortDocument>;
    findByIdForAdmin(id: string, organizationId: string): Promise<import("./schemas/cohort.schema").CohortDocument>;
    create(organizationId: string, createCohortDto: CreateCohortDto): Promise<import("./schemas/cohort.schema").CohortDocument>;
    update(id: string, organizationId: string, updateCohortDto: UpdateCohortDto): Promise<import("./schemas/cohort.schema").CohortDocument>;
    remove(id: string, organizationId: string): Promise<import("./schemas/cohort.schema").CohortDocument>;
}
