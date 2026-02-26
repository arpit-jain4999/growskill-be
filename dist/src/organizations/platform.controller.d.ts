import { Actor } from '../common/types/actor';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, AssignSuperAdminDto } from './dto/create-organization.dto';
export declare class PlatformController {
    private organizationsService;
    constructor(organizationsService: OrganizationsService);
    private ensurePlatformOwner;
    create(dto: CreateOrganizationDto, actor: Actor): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    createWithSuperAdmin(body: {
        organization: CreateOrganizationDto;
        superAdmin: AssignSuperAdminDto;
    }, actor: Actor): Promise<{
        organization: import("./schemas/organization.schema").OrganizationDocument;
        user: import("../auth/schemas/user.schema").UserDocument;
    }>;
    list(actor: Actor): Promise<import("./schemas/organization.schema").OrganizationDocument[]>;
    getModuleKeys(actor: Actor): import("./organizations.service").ModuleKeyInfo[];
    get(orgId: string, actor: Actor): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    getOrgUsers(orgId: string, actor: Actor): Promise<import("../auth/schemas/user.schema").UserDocument[]>;
    getOrgModules(orgId: string, actor: Actor): Promise<import("./organizations.service").OrgModuleInfo[]>;
    enableOrgModule(orgId: string, moduleKey: string, actor: Actor): Promise<{
        enabled: string;
    }>;
    disableOrgModule(orgId: string, moduleKey: string, actor: Actor): Promise<{
        disabled: string;
    }>;
    setUserRole(orgId: string, userId: string, body: {
        role: string;
    }, actor: Actor): Promise<import("../auth/schemas/user.schema").UserDocument>;
    update(orgId: string, dto: Partial<CreateOrganizationDto>, actor: Actor): Promise<import("./schemas/organization.schema").OrganizationDocument>;
    delete(orgId: string, actor: Actor): Promise<{
        deleted: string;
    }>;
    assignSuperAdmin(orgId: string, dto: AssignSuperAdminDto, actor: Actor): Promise<import("../auth/schemas/user.schema").UserDocument>;
}
