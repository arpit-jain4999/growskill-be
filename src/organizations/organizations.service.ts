import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationModuleRepository } from './repositories/organization-module.repository';
import { PermissionsService } from '../permissions/permissions.service';
import { ROLES } from '../common/constants/roles';
import { MODULE_KEYS, MODULE_PERMISSIONS } from '../common/constants/permissions';
import { normalizeCountryCode, normalizePhoneNumber } from '../common/helpers/phone';
import { LoggerService } from '../common/services/logger.service';

const DEFAULT_ORG_MODULES = [MODULE_KEYS.COURSES, MODULE_KEYS.COHORTS, MODULE_KEYS.MODULES] as const;

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

@Injectable()
export class OrganizationsService {
  constructor(
    private orgRepo: OrganizationRepository,
    private orgModuleRepo: OrganizationModuleRepository,
    private permissionsService: PermissionsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private logger: LoggerService,
  ) {
    this.logger.setContext('OrganizationsService');
  }

  async create(dto: CreateOrganizationDto): Promise<OrganizationDocument> {
    const org = await this.orgRepo.create(dto);
    this.logger.log(`Created organization: ${org._id}`);
    return org;
  }

  async findAll(): Promise<OrganizationDocument[]> {
    return this.orgRepo.findAll();
  }

  async findById(id: string): Promise<OrganizationDocument> {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(
    id: string,
    dto: Partial<CreateOrganizationDto>,
  ): Promise<OrganizationDocument> {
    const org = await this.orgRepo.update(id, dto);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async createWithSuperAdmin(
    dto: CreateOrganizationDto,
    superAdmin: AssignSuperAdminDto,
  ): Promise<{ organization: OrganizationDocument; user: UserDocument }> {
    const org = await this.orgRepo.create(dto);
    const existingSuperAdmin = await this.userModel.findOne({
      organizationId: org._id,
      role: ROLES.SUPER_ADMIN,
    });
    if (existingSuperAdmin) {
      throw new ConflictException('Organization already has a SUPER_ADMIN');
    }
    const user = await this.userModel.create({
      organizationId: org._id,
      email: superAdmin.email,
      name: superAdmin.name,
      countryCode: normalizeCountryCode(superAdmin.countryCode),
      phoneNumber: normalizePhoneNumber(superAdmin.phoneNumber),
      role: ROLES.SUPER_ADMIN,
      isVerified: false,
    });
    for (const moduleKey of DEFAULT_ORG_MODULES) {
      await this.enableModule(org._id.toString(), moduleKey, user._id.toString());
    }
    this.logger.log(
      `Created org ${org._id} with SUPER_ADMIN ${user._id}; enabled modules: ${DEFAULT_ORG_MODULES.join(', ')}`,
    );
    return { organization: org, user };
  }

  async assignInitialSuperAdmin(
    orgId: string,
    dto: AssignSuperAdminDto,
  ): Promise<UserDocument> {
    const org = await this.findById(orgId);
    const existing = await this.userModel.findOne({
      organizationId: new Types.ObjectId(orgId),
      role: ROLES.SUPER_ADMIN,
    });
    if (existing) {
      throw new ConflictException('Organization already has a SUPER_ADMIN');
    }
    const user = await this.userModel.create({
      organizationId: org._id,
      email: dto.email,
      name: dto.name,
      countryCode: normalizeCountryCode(dto.countryCode),
      phoneNumber: normalizePhoneNumber(dto.phoneNumber),
      role: ROLES.SUPER_ADMIN,
      isVerified: false,
    });
    for (const moduleKey of DEFAULT_ORG_MODULES) {
      await this.enableModule(orgId, moduleKey, user._id.toString());
    }
    this.logger.log(
      `Assigned SUPER_ADMIN ${user._id} to org ${orgId}; enabled modules: ${DEFAULT_ORG_MODULES.join(', ')}`,
    );
    return user;
  }

  /**
   * Enable a feature module for an org and sync the corresponding permission keys
   * into the OrgPermission collection.
   */
  async enableModule(
    organizationId: string,
    moduleKey: string,
    enabledByUserId: string,
  ): Promise<void> {
    await this.orgModuleRepo.enable(organizationId, moduleKey, enabledByUserId);
    await this.permissionsService.syncOrgPermissionsForModule(
      organizationId,
      moduleKey,
      true,
      enabledByUserId,
    );
    this.logger.log(`Enabled module ${moduleKey} for org ${organizationId}`);
  }

  /**
   * Disable a feature module for an org and remove the corresponding permission keys
   * from the OrgPermission collection.
   */
  async disableModule(organizationId: string, moduleKey: string): Promise<void> {
    await this.orgModuleRepo.disable(organizationId, moduleKey);
    await this.permissionsService.syncOrgPermissionsForModule(
      organizationId,
      moduleKey,
      false,
      '',
    );
    this.logger.log(`Disabled module ${moduleKey} for org ${organizationId}`);
  }

  async getEnabledModules(organizationId: string): Promise<string[]> {
    const docs = await this.orgModuleRepo.findEnabledByOrg(organizationId);
    return docs.map((d) => d.moduleKey);
  }

  async getModulesForOrg(organizationId: string): Promise<OrgModuleInfo[]> {
    const allKeys = Object.values(MODULE_KEYS);
    const docs = await this.orgModuleRepo.findAllByOrg(organizationId);
    const byKey = new Map(docs.map((d) => [d.moduleKey, d]));
    return allKeys.map((moduleKey) => {
      const doc = byKey.get(moduleKey);
      return {
        moduleKey,
        enabled: !!doc?.enabled,
        enabledAt: doc?.enabledAt?.toISOString(),
        enabledByUserId: doc?.enabledByUserId?.toString(),
      };
    });
  }

  async findUsersByOrg(orgId: string): Promise<UserDocument[]> {
    await this.findById(orgId);
    return this.userModel
      .find({ organizationId: new Types.ObjectId(orgId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async setUserRoleByPlatform(
    orgId: string,
    userId: string,
    role: string,
  ): Promise<UserDocument> {
    await this.findById(orgId);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const userOrgId = user.organizationId?.toString();
    if (userOrgId !== orgId) {
      throw new ForbiddenException('User does not belong to this organisation');
    }
    const allowed = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowed.includes(role)) {
      throw new ForbiddenException(`Role must be one of: ${allowed.join(', ')}`);
    }
    user.role = role as any;
    await user.save();
    this.logger.log(`Platform set user ${userId} role to ${role} in org ${orgId}`);
    return user;
  }

  getAvailableModuleKeys(): ModuleKeyInfo[] {
    const labels: Record<string, string> = {
      [MODULE_KEYS.COURSES]: 'Courses',
      [MODULE_KEYS.COHORTS]: 'Cohorts',
      [MODULE_KEYS.MODULES]: 'Content modules',
      [MODULE_KEYS.CHAPTERS]: 'Chapters',
      [MODULE_KEYS.ASSESSMENTS]: 'Assessments',
    };
    return Object.values(MODULE_KEYS).map((key) => ({
      key,
      label: labels[key] ?? key,
      permissions: MODULE_PERMISSIONS[key] ?? [],
    }));
  }
}
