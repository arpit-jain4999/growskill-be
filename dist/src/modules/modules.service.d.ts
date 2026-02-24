import { ModuleRepository } from './repositories/module.repository';
import { ChaptersService } from '../chapters/chapters.service';
import { LoggerService } from '../common/services/logger.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
export declare class ModulesService {
    private moduleRepository;
    private chaptersService;
    private logger;
    constructor(moduleRepository: ModuleRepository, chaptersService: ChaptersService, logger: LoggerService);
    findAll(): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    findAllForAdmin(organizationId: string): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    findById(id: string): Promise<import("./schemas/module.schema").ModuleDocument>;
    findByIdForAdmin(id: string, organizationId: string): Promise<import("./schemas/module.schema").ModuleDocument>;
    findByCourseId(courseId: string): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    create(organizationId: string, dto: CreateModuleDto): Promise<import("./schemas/module.schema").ModuleDocument>;
    update(id: string, organizationId: string, dto: UpdateModuleDto): Promise<import("./schemas/module.schema").ModuleDocument>;
    remove(id: string, organizationId: string): Promise<import("./schemas/module.schema").ModuleDocument>;
}
