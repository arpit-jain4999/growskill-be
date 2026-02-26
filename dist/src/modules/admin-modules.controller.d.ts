import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Actor } from '../common/types/actor';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class AdminModulesController {
    private readonly modulesService;
    private readonly organizationsService;
    constructor(modulesService: ModulesService, organizationsService: OrganizationsService);
    private resolveOrgId;
    findAll(actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/module.schema").ModuleDocument[]>;
    findOne(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/module.schema").ModuleDocument>;
    create(dto: CreateModuleDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/module.schema").ModuleDocument>;
    update(id: string, dto: UpdateModuleDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/module.schema").ModuleDocument>;
    remove(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/module.schema").ModuleDocument>;
}
