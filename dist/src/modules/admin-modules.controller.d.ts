import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Actor } from '../common/types/actor';
export declare class AdminModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAll(actor: Actor): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    findOne(id: string, actor: Actor): Promise<import("./schemas/module.schema").ModuleDocument>;
    create(dto: CreateModuleDto, actor: Actor): Promise<import("./schemas/module.schema").ModuleDocument>;
    update(id: string, dto: UpdateModuleDto, actor: Actor): Promise<import("./schemas/module.schema").ModuleDocument>;
    remove(id: string, actor: Actor): Promise<import("./schemas/module.schema").ModuleDocument>;
}
