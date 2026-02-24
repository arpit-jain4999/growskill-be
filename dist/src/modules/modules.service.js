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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const module_repository_1 = require("./repositories/module.repository");
const chapters_service_1 = require("../chapters/chapters.service");
const logger_service_1 = require("../common/services/logger.service");
let ModulesService = class ModulesService {
    constructor(moduleRepository, chaptersService, logger) {
        this.moduleRepository = moduleRepository;
        this.chaptersService = chaptersService;
        this.logger = logger;
        this.logger.setContext('ModulesService');
    }
    async findAll() {
        this.logger.log('Fetching all modules');
        return this.moduleRepository.findAll();
    }
    async findAllForAdmin(organizationId) {
        this.logger.log('Fetching all modules for admin');
        return this.moduleRepository.findAllForAdmin(organizationId);
    }
    async findById(id) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Fetching module: ${id}`);
        const module = await this.moduleRepository.findById(id);
        if (!module) {
            throw new common_1.NotFoundException('Module not found');
        }
        return module;
    }
    async findByIdForAdmin(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Fetching module for admin: ${id}`);
        const module = await this.moduleRepository.findById(id, organizationId);
        if (!module)
            throw new common_1.NotFoundException('Module not found');
        return module;
    }
    async findByCourseId(courseId) {
        if (!courseId || !mongoose_1.Types.ObjectId.isValid(courseId))
            throw new common_1.BadRequestException('Invalid course ID');
        this.logger.log(`Fetching modules for course: ${courseId}`);
        return this.moduleRepository.findByCourseId(courseId);
    }
    async create(organizationId, dto) {
        this.logger.log(`Creating module: ${dto.title}`);
        const data = {
            ...dto,
            organizationId: new mongoose_1.Types.ObjectId(organizationId),
        };
        if (dto.courseId) {
            data.courseId = new mongoose_1.Types.ObjectId(dto.courseId);
        }
        const mod = await this.moduleRepository.create(data);
        this.logger.log(`Module created: ${mod._id}`);
        return mod;
    }
    async update(id, organizationId, dto) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Updating module: ${id}`);
        const existing = await this.moduleRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Module not found');
        const data = { ...dto };
        if (dto.courseId) {
            data.courseId = new mongoose_1.Types.ObjectId(dto.courseId);
        }
        const updated = await this.moduleRepository.update(id, organizationId, data);
        this.logger.log(`Module updated: ${id}`);
        return updated;
    }
    async remove(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Deleting module: ${id}`);
        const existing = await this.moduleRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Module not found');
        await this.chaptersService.removeByModuleId(id, organizationId);
        const deleted = await this.moduleRepository.delete(id, organizationId);
        this.logger.log(`Module deleted: ${id}`);
        return deleted;
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [module_repository_1.ModuleRepository,
        chapters_service_1.ChaptersService,
        logger_service_1.LoggerService])
], ModulesService);
//# sourceMappingURL=modules.service.js.map