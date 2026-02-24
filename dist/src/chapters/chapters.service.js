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
exports.ChaptersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const chapter_repository_1 = require("./repositories/chapter.repository");
const logger_service_1 = require("../common/services/logger.service");
let ChaptersService = class ChaptersService {
    constructor(chapterRepository, logger) {
        this.chapterRepository = chapterRepository;
        this.logger = logger;
        this.logger.setContext('ChaptersService');
    }
    async findAll() {
        this.logger.log('Fetching all chapters');
        return this.chapterRepository.findAll();
    }
    async findAllForAdmin(organizationId) {
        this.logger.log('Fetching all chapters for admin');
        return this.chapterRepository.findAllForAdmin(organizationId);
    }
    async findById(id) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid chapter ID');
        this.logger.log(`Fetching chapter: ${id}`);
        const chapter = await this.chapterRepository.findById(id);
        if (!chapter)
            throw new common_1.NotFoundException('Chapter not found');
        return chapter;
    }
    async findByIdForAdmin(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid chapter ID');
        this.logger.log(`Fetching chapter for admin: ${id}`);
        const chapter = await this.chapterRepository.findById(id, organizationId);
        if (!chapter)
            throw new common_1.NotFoundException('Chapter not found');
        return chapter;
    }
    async findByModuleId(moduleId) {
        if (!moduleId || !mongoose_1.Types.ObjectId.isValid(moduleId))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Fetching chapters for module: ${moduleId}`);
        return this.chapterRepository.findByModuleId(moduleId);
    }
    async findByModuleIdForAdmin(moduleId, organizationId) {
        if (!moduleId || !mongoose_1.Types.ObjectId.isValid(moduleId))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Fetching chapters for module (admin): ${moduleId}`);
        return this.chapterRepository.findByModuleIdForAdmin(moduleId, organizationId);
    }
    async create(organizationId, dto) {
        if (!dto.moduleId || !mongoose_1.Types.ObjectId.isValid(dto.moduleId)) {
            throw new common_1.BadRequestException('Invalid module ID');
        }
        this.logger.log(`Creating chapter: ${dto.title}`);
        const data = {
            ...dto,
            organizationId: new mongoose_1.Types.ObjectId(organizationId),
            moduleId: new mongoose_1.Types.ObjectId(dto.moduleId),
        };
        const chapter = await this.chapterRepository.create(data);
        this.logger.log(`Chapter created: ${chapter._id}`);
        return chapter;
    }
    async update(id, organizationId, dto) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid chapter ID');
        this.logger.log(`Updating chapter: ${id}`);
        const existing = await this.chapterRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Chapter not found');
        const data = { ...dto };
        if (dto.moduleId) {
            data.moduleId = new mongoose_1.Types.ObjectId(dto.moduleId);
        }
        const updated = await this.chapterRepository.update(id, organizationId, data);
        this.logger.log(`Chapter updated: ${id}`);
        return updated;
    }
    async remove(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid chapter ID');
        this.logger.log(`Deleting chapter: ${id}`);
        const existing = await this.chapterRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Chapter not found');
        const deleted = await this.chapterRepository.delete(id, organizationId);
        this.logger.log(`Chapter deleted: ${id}`);
        return deleted;
    }
    async removeByModuleId(moduleId, organizationId) {
        if (!moduleId || !mongoose_1.Types.ObjectId.isValid(moduleId))
            throw new common_1.BadRequestException('Invalid module ID');
        this.logger.log(`Deleting all chapters for module: ${moduleId}`);
        const count = await this.chapterRepository.deleteByModuleId(moduleId, organizationId);
        this.logger.log(`Deleted ${count} chapters for module: ${moduleId}`);
        return count;
    }
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chapter_repository_1.ChapterRepository,
        logger_service_1.LoggerService])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map