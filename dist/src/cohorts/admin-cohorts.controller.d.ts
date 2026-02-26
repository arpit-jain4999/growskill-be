import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { Actor } from '../common/types/actor';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class AdminCohortsController {
    private readonly cohortsService;
    private readonly organizationsService;
    constructor(cohortsService: CohortsService, organizationsService: OrganizationsService);
    private resolveOrgId;
    findAllForAdmin(actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/cohort.schema").CohortDocument[]>;
    findOneForAdmin(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/cohort.schema").CohortDocument>;
    create(createCohortDto: CreateCohortDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/cohort.schema").CohortDocument>;
    update(id: string, updateCohortDto: UpdateCohortDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/cohort.schema").CohortDocument>;
    remove(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/cohort.schema").CohortDocument>;
}
