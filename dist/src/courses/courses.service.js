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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const course_repository_1 = require("./repositories/course.repository");
const logger_service_1 = require("../common/services/logger.service");
let CoursesService = class CoursesService {
    constructor(courseRepository, logger) {
        this.courseRepository = courseRepository;
        this.logger = logger;
        this.logger.setContext('CoursesService');
    }
    async findAll(filter) {
        this.logger.log('Fetching all courses', JSON.stringify(filter));
        return this.courseRepository.findAll(filter);
    }
    async findAllForAdmin(organizationId) {
        this.logger.log('Fetching all courses for admin');
        return this.courseRepository.findAllForAdmin(organizationId);
    }
    async findById(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid course ID');
        }
        this.logger.log(`Fetching course: ${id}`);
        const course = await this.courseRepository.findById(id, organizationId);
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async findMyCourses(userId, organizationId) {
        this.logger.log(`Fetching courses for user: ${userId}`);
        return this.courseRepository.findByUserId(userId, organizationId);
    }
    async create(organizationId, instructorId, dto) {
        this.logger.log(`Creating course: ${dto.title}`);
        const data = {
            ...dto,
            organizationId: new mongoose_1.Types.ObjectId(organizationId),
            instructorId: new mongoose_1.Types.ObjectId(instructorId),
        };
        if (dto.cohortId) {
            data.cohortId = new mongoose_1.Types.ObjectId(dto.cohortId);
        }
        const course = await this.courseRepository.create(data);
        this.logger.log(`Course created: ${course._id}`);
        return course;
    }
    async update(id, organizationId, dto) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid course ID');
        this.logger.log(`Updating course: ${id}`);
        const existing = await this.courseRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Course not found');
        const data = { ...dto };
        if (dto.cohortId) {
            data.cohortId = new mongoose_1.Types.ObjectId(dto.cohortId);
        }
        const updated = await this.courseRepository.update(id, organizationId, data);
        this.logger.log(`Course updated: ${id}`);
        return updated;
    }
    async remove(id, organizationId) {
        if (!id || !mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid course ID');
        this.logger.log(`Deleting course: ${id}`);
        const existing = await this.courseRepository.findById(id, organizationId);
        if (!existing)
            throw new common_1.NotFoundException('Course not found');
        const deleted = await this.courseRepository.delete(id, organizationId);
        this.logger.log(`Course deleted: ${id}`);
        return deleted;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [course_repository_1.CourseRepository,
        logger_service_1.LoggerService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map