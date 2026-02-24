import { ModulesService } from './modules.service';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAll(): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    findOne(id: string): Promise<import("./schemas/module.schema").ModuleDocument>;
    findByCourse(courseId: string): Promise<import("./schemas/module.schema").ModuleDocument[]>;
}
