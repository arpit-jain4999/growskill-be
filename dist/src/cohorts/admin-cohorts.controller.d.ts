import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { Actor } from '../common/types/actor';
export declare class AdminCohortsController {
    private readonly cohortsService;
    constructor(cohortsService: CohortsService);
    findAllForAdmin(actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument[]>;
    findOneForAdmin(id: string, actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument>;
    create(createCohortDto: CreateCohortDto, actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument>;
    update(id: string, updateCohortDto: UpdateCohortDto, actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument>;
    remove(id: string, actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument>;
}
