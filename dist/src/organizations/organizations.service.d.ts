import { Model } from 'mongoose';
import { OrganizationDocument } from './schemas/organization.schema';
import { UserDocument } from '../auth/schemas/user.schema';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationModuleRepository } from './repositories/organization-module.repository';
import { PermissionsService } from '../permissions/permissions.service';
import { LoggerService } from '../common/services/logger.service';
export interface OrgModuleInfo {
    moduleKey: string;
    enabled: boolean;
    enabledAt?: string;
    enabledByUserId?: string;
}
export interface ModuleKeyInfo {
    key: string;
    label: string;
    permissions: string[];
}
export interface CreateOrganizationDto {
    name: string;
    gstNumber?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    contactPersonName: string;
    contactPersonNumber: string;
    billingDetails?: {
        companyName?: string;
        billingEmail?: string;
        billingAddress?: Record<string, unknown>;
        notes?: string;
    };
}
export interface AssignSuperAdminDto {
    email: string;
    name: string;
    countryCode: string;
    phoneNumber: string;
}
export declare class OrganizationsService {
    private orgRepo;
    private orgModuleRepo;
    private permissionsService;
    private userModel;
    private logger;
    constructor(orgRepo: OrganizationRepository, orgModuleRepo: OrganizationModuleRepository, permissionsService: PermissionsService, userModel: Model<UserDocument>, logger: LoggerService);
    create(dto: CreateOrganizationDto): Promise<OrganizationDocument>;
    findAll(): Promise<OrganizationDocument[]>;
    findById(id: string): Promise<OrganizationDocument>;
    update(id: string, dto: Partial<CreateOrganizationDto>): Promise<OrganizationDocument>;
    createWithSuperAdmin(dto: CreateOrganizationDto, superAdmin: AssignSuperAdminDto): Promise<{
        organization: OrganizationDocument;
        user: UserDocument;
    }>;
    assignInitialSuperAdmin(orgId: string, dto: AssignSuperAdminDto): Promise<UserDocument>;
    enableModule(organizationId: string, moduleKey: string, enabledByUserId: string): Promise<void>;
    disableModule(organizationId: string, moduleKey: string): Promise<void>;
    getEnabledModules(organizationId: string): Promise<string[]>;
    getModulesForOrg(organizationId: string): Promise<OrgModuleInfo[]>;
    findUsersByOrg(orgId: string): Promise<UserDocument[]>;
    setUserRoleByPlatform(orgId: string, userId: string, role: string): Promise<UserDocument>;
    getAvailableModuleKeys(): ModuleKeyInfo[];
}
