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
exports.AdminCoursesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const course_response_dto_1 = require("./dto/course-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
const roles_1 = require("../common/constants/roles");
const organizations_service_1 = require("../organizations/organizations.service");
let AdminCoursesController = class AdminCoursesController {
    constructor(coursesService, organizationsService) {
        this.coursesService = coursesService;
        this.organizationsService = organizationsService;
    }
    async resolveOrgId(actor, request) {
        let orgId = actor.organizationId ?? null;
        if (!orgId && actor.role === roles_1.ROLES.PLATFORM_OWNER && request?.headers) {
            const raw = request.headers['x-org-id'] ?? request.headers['X-Org-Id'];
            const trimmed = typeof raw === 'string' ? raw.trim() : '';
            if (trimmed) {
                await this.organizationsService.findById(trimmed);
                orgId = trimmed;
            }
        }
        if (!orgId) {
            throw new common_1.BadRequestException('x-org-id header required for this operation');
        }
        return orgId;
    }
    async findAll(actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.coursesService.findAllForAdmin(orgId);
    }
    async findOne(id, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.coursesService.findById(id, orgId);
    }
    async create(dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.coursesService.create(orgId, actor.userId, dto);
    }
    async update(id, dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.coursesService.update(id, orgId, dto);
    }
    async remove(id, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.coursesService.remove(id, orgId);
    }
};
exports.AdminCoursesController = AdminCoursesController;
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all courses', description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all courses', type: [course_response_dto_1.CourseResponseDto] }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('courses/:id'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get course by ID', description: 'Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Course found', type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('course'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COURSE_CREATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create course', description: 'Creates a course. The authenticated user becomes the instructor. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Course created', type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('course/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COURSE_UPDATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update course', description: 'PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Course updated', type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('course/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COURSE_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete course', description: 'PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Course deleted', type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCoursesController.prototype, "remove", null);
exports.AdminCoursesController = AdminCoursesController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService,
        organizations_service_1.OrganizationsService])
], AdminCoursesController);
//# sourceMappingURL=admin-courses.controller.js.map