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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const cohort_repository_1 = require("./repositories/cohort.repository");
const logger_service_1 = require("../common/services/logger.service");
let CohortsService = class CohortsService {
    constructor(cohortRepository, logger) {
        this.cohortRepository = cohortRepository;
        this.logger = logger;
        this.logger.setContext('CohortsService');
    }
    async findAll(organizationId) {
        this.logger.log('Fetching all active cohorts');
        return this.cohortRepository.findAll(organizationId);
    }
    async findAllForAdmin(organizationId) {
        this.logger.log('Fetching all cohorts for admin');
        return this.cohortRepository.findAllForAdmin(organizationId);
    }
    async findById(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid cohort ID');
        this.logger.log(`Fetching cohort: ${id}`);
        const cohort = await this.cohortRepository.findById(id, organizationId);
        if (!cohort)
            throw new common_1.NotFoundException('Cohort not found');
        if (!cohort.isActive)
            throw new common_1.NotFoundException('Cohort not found');
        return cohort;
    }
    async findByIdForAdmin(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid cohort ID');
        this.logger.log(`Fetching cohort for admin: ${id}`);
        const cohort = await this.cohortRepository.findById(id, organizationId);
        if (!cohort)
            throw new common_1.NotFoundException('Cohort not found');
        return cohort;
    }
    async create(organizationId, createCohortDto) {
        this.logger.log(`Creating new cohort: ${createCohortDto.name}`);
        const cohortData = {
            ...createCohortDto,
            organizationId: new mongoose_1.Types.ObjectId(organizationId),
            countryCode: createCohortDto.countryCode || 'IN',
            displayOrder: createCohortDto.displayOrder ?? 0,
            isVisibleOnHomePage: createCohortDto.isVisibleOnHomePage ?? false,
            isActive: true,
        };
        const cohort = await this.cohortRepository.create(cohortData);
        this.logger.log(`Cohort created successfully: ${cohort._id}`);
        return cohort;
    }
    async update(id, organizationId, updateCohortDto) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid cohort ID');
        this.logger.log(`Updating cohort: ${id}`);
        const cohort = await this.cohortRepository.findById(id, organizationId);
        if (!cohort)
            throw new common_1.NotFoundException('Cohort not found');
        const updated = await this.cohortRepository.update(id, organizationId, updateCohortDto);
        this.logger.log(`Cohort updated successfully: ${id}`);
        return updated;
    }
    async remove(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid cohort ID');
        this.logger.log(`Soft deleting cohort: ${id}`);
        const cohort = await this.cohortRepository.findById(id, organizationId);
        if (!cohort)
            throw new common_1.NotFoundException('Cohort not found');
        if (!cohort.isActive)
            throw new common_1.ConflictException('Cohort is already inactive');
        const deleted = await this.cohortRepository.softDelete(id, organizationId);
        this.logger.log(`Cohort soft deleted successfully: ${id}`);
        return deleted;
    }
};
exports.CohortsService = CohortsService;
exports.CohortsService = CohortsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cohort_repository_1.CohortRepository,
        logger_service_1.LoggerService])
], CohortsService);
//# sourceMappingURL=cohorts.service.js.map