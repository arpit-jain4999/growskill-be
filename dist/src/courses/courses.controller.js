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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const course_response_dto_1 = require("./dto/course-response.dto");
const find_all_courses_query_dto_1 = require("./dto/find-all-courses-query.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const tenant_context_guard_2 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async findAll(query, actor) {
        return this.coursesService.findAll({
            organizationId: actor.organizationId,
            name: query.name,
            cohortId: query.cohortId,
        });
    }
    async findMyCourses(actor) {
        return this.coursesService.findMyCourses(actor.userId, actor.organizationId);
    }
    async findOne(id, actor) {
        return this.coursesService.findById(id, actor.organizationId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all published courses',
        description: 'Returns all published courses. Optional query params: **name** (search by course title, case-insensitive) and **cohortId** (filter by cohort). Public endpoint.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        type: String,
        description: 'Search by course name (title). Case-insensitive partial match.',
        example: 'Node.js',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cohortId',
        required: false,
        type: String,
        description: 'Filter courses by cohort ID (MongoDB ObjectId).',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of published courses. Response: `{ success: true, data: Course[] }`. Each course includes _id, title, description, fee (amount, discount, total), cohortId, isPublished, enrollmentCount, thumbnail, category, rating, totalRatings, createdAt, updatedAt.',
        type: course_response_dto_1.CourseListApiResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_courses_query_dto_1.FindAllCoursesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-courses'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my courses',
        description: 'Returns courses for the authenticated user (instructor). Requires JWT.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of courses for the current user. API response format: { success, data }.',
        type: course_response_dto_1.CourseListApiResponseDto,
    }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findMyCourses", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get course by ID',
        description: 'Tenant-scoped. Returns a single published course by ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID (MongoDB ObjectId)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Course found. API response format: { success, data }.',
        type: course_response_dto_1.CourseApiResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Course not found',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findOne", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, swagger_1.ApiExtraModels)(course_response_dto_1.CourseResponseDto, course_response_dto_1.FeeDto, find_all_courses_query_dto_1.FindAllCoursesQueryDto),
    (0, common_1.Controller)('v1/courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_2.RequireTenantGuard, authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COURSE_READ),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map