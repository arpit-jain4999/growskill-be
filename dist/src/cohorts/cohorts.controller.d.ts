import { CohortsService } from './cohorts.service';
import { Actor } from '../common/types/actor';
export declare class CohortsController {
    private readonly cohortsService;
    constructor(cohortsService: CohortsService);
    findAll(actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument[]>;
    findOne(id: string, actor: Actor): Promise<import("./schemas/cohort.schema").CohortDocument>;
}
