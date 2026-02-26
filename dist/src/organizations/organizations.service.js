"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const cohort_schema_1 = require("../cohorts/schemas/cohort.schema");
const course_schema_1 = require("../courses/schemas/course.schema");
const module_schema_1 = require("../modules/schemas/module.schema");
const chapter_schema_1 = require("../chapters/schemas/chapter.schema");
const organization_repository_1 = require("./repositories/organization.repository");
const organization_module_repository_1 = require("./repositories/organization-module.repository");
const permissions_service_1 = require("../permissions/permissions.service");
const roles_1 = require("../common/constants/roles");
const permissions_1 = require("../common/constants/permissions");
const phone_1 = require("../common/helpers/phone");
const logger_service_1 = require("../common/services/logger.service");
const DEFAULT_ORG_MODULES = [permissions_1.MODULE_KEYS.COURSES, permissions_1.MODULE_KEYS.COHORTS, permissions_1.MODULE_KEYS.MODULES];
let OrganizationsService = class OrganizationsService {
    constructor(orgRepo, orgModuleRepo, permissionsService, userModel, orderModel, cohortModel, courseModel, contentModuleModel, chapterModel, logger) {
        this.orgRepo = orgRepo;
        this.orgModuleRepo = orgModuleRepo;
        this.permissionsService = permissionsService;
        this.userModel = userModel;
        this.orderModel = orderModel;
        this.cohortModel = cohortModel;
        this.courseModel = courseModel;
        this.contentModuleModel = contentModuleModel;
        this.chapterModel = chapterModel;
        this.logger = logger;
        this.logger.setContext('OrganizationsService');
    }
    async create(dto) {
        const org = await this.orgRepo.create(dto);
        this.logger.log(`Created organization: ${org._id}`);
        return org;
    }
    async findAll() {
        return this.orgRepo.findAll();
    }
    async findById(id) {
        const org = await this.orgRepo.findById(id);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async update(id, dto) {
        const org = await this.orgRepo.update(id, dto);
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async remove(orgId) {
        const org = await this.findById(orgId);
        const oid = new mongoose_2.Types.ObjectId(orgId);
        await this.orderModel.deleteMany({ organizationId: oid }).exec();
        await this.chapterModel.deleteMany({ organizationId: oid }).exec();
        await this.contentModuleModel.deleteMany({ organizationId: oid }).exec();
        await this.courseModel.deleteMany({ organizationId: oid }).exec();
        await this.cohortModel.deleteMany({ organizationId: oid }).exec();
        await this.userModel.deleteMany({ organizationId: oid }).exec();
        await this.permissionsService.deleteAllForOrganization(orgId);
        await this.orgModuleRepo.deleteByOrg(orgId);
        await this.orgRepo.delete(orgId);
        this.logger.log(`Deleted organization ${orgId} and all associated data`);
    }
    async createWithSuperAdmin(dto, superAdmin) {
        const org = await this.orgRepo.create(dto);
        const existingSuperAdmin = await this.userModel.findOne({
            organizationId: org._id,
            role: roles_1.ROLES.SUPER_ADMIN,
        });
        if (existingSuperAdmin) {
            throw new common_1.ConflictException('Organization already has a SUPER_ADMIN');
        }
        const user = await this.userModel.create({
            organizationId: org._id,
            email: superAdmin.email,
            name: superAdmin.name,
            countryCode: (0, phone_1.normalizeCountryCode)(superAdmin.countryCode),
            phoneNumber: (0, phone_1.normalizePhoneNumber)(superAdmin.phoneNumber),
            role: roles_1.ROLES.SUPER_ADMIN,
            isVerified: false,
        });
        for (const moduleKey of DEFAULT_ORG_MODULES) {
            await this.enableModule(org._id.toString(), moduleKey, user._id.toString());
        }
        this.logger.log(`Created org ${org._id} with SUPER_ADMIN ${user._id}; enabled modules: ${DEFAULT_ORG_MODULES.join(', ')}`);
        return { organization: org, user };
    }
    async assignInitialSuperAdmin(orgId, dto) {
        const org = await this.findById(orgId);
        const existing = await this.userModel.findOne({
            organizationId: new mongoose_2.Types.ObjectId(orgId),
            role: roles_1.ROLES.SUPER_ADMIN,
        });
        if (existing) {
            throw new common_1.ConflictException('Organization already has a SUPER_ADMIN');
        }
        const user = await this.userModel.create({
            organizationId: org._id,
            email: dto.email,
            name: dto.name,
            countryCode: (0, phone_1.normalizeCountryCode)(dto.countryCode),
            phoneNumber: (0, phone_1.normalizePhoneNumber)(dto.phoneNumber),
            role: roles_1.ROLES.SUPER_ADMIN,
            isVerified: false,
        });
        for (const moduleKey of DEFAULT_ORG_MODULES) {
            await this.enableModule(orgId, moduleKey, user._id.toString());
        }
        this.logger.log(`Assigned SUPER_ADMIN ${user._id} to org ${orgId}; enabled modules: ${DEFAULT_ORG_MODULES.join(', ')}`);
        return user;
    }
    async enableModule(organizationId, moduleKey, enabledByUserId) {
        await this.orgModuleRepo.enable(organizationId, moduleKey, enabledByUserId);
        await this.permissionsService.syncOrgPermissionsForModule(organizationId, moduleKey, true, enabledByUserId);
        this.logger.log(`Enabled module ${moduleKey} for org ${organizationId}`);
    }
    async disableModule(organizationId, moduleKey) {
        await this.orgModuleRepo.disable(organizationId, moduleKey);
        await this.permissionsService.syncOrgPermissionsForModule(organizationId, moduleKey, false, '');
        this.logger.log(`Disabled module ${moduleKey} for org ${organizationId}`);
    }
    async getEnabledModules(organizationId) {
        const docs = await this.orgModuleRepo.findEnabledByOrg(organizationId);
        return docs.map((d) => d.moduleKey);
    }
    async getModulesForOrg(organizationId) {
        const allKeys = Object.values(permissions_1.MODULE_KEYS);
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
    async findUsersByOrg(orgId) {
        await this.findById(orgId);
        return this.userModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(orgId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async setUserRoleByPlatform(orgId, userId, role) {
        await this.findById(orgId);
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userOrgId = user.organizationId?.toString();
        if (userOrgId !== orgId) {
            throw new common_1.ForbiddenException('User does not belong to this organisation');
        }
        const allowed = ['USER', 'ADMIN', 'SUPER_ADMIN'];
        if (!allowed.includes(role)) {
            throw new common_1.ForbiddenException(`Role must be one of: ${allowed.join(', ')}`);
        }
        user.role = role;
        await user.save();
        this.logger.log(`Platform set user ${userId} role to ${role} in org ${orgId}`);
        return user;
    }
    getAvailableModuleKeys() {
        const labels = {
            [permissions_1.MODULE_KEYS.COURSES]: 'Courses',
            [permissions_1.MODULE_KEYS.COHORTS]: 'Cohorts',
            [permissions_1.MODULE_KEYS.MODULES]: 'Content modules',
            [permissions_1.MODULE_KEYS.CHAPTERS]: 'Chapters',
            [permissions_1.MODULE_KEYS.ASSESSMENTS]: 'Assessments',
        };
        return Object.values(permissions_1.MODULE_KEYS).map((key) => ({
            key,
            label: labels[key] ?? key,
            permissions: permissions_1.MODULE_PERMISSIONS[key] ?? [],
        }));
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(5, (0, mongoose_1.InjectModel)(cohort_schema_1.Cohort.name)),
    __param(6, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __param(7, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __param(8, (0, mongoose_1.InjectModel)(chapter_schema_1.Chapter.name)),
    __metadata("design:paramtypes", [organization_repository_1.OrganizationRepository,
        organization_module_repository_1.OrganizationModuleRepository,
        permissions_service_1.PermissionsService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        logger_service_1.LoggerService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map