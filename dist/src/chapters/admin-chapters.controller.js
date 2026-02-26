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
exports.AdminChaptersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chapters_service_1 = require("./chapters.service");
const create_chapter_dto_1 = require("./dto/create-chapter.dto");
const update_chapter_dto_1 = require("./dto/update-chapter.dto");
const chapter_response_dto_1 = require("./dto/chapter-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
const roles_1 = require("../common/constants/roles");
const organizations_service_1 = require("../organizations/organizations.service");
let AdminChaptersController = class AdminChaptersController {
    constructor(chaptersService, organizationsService) {
        this.chaptersService = chaptersService;
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
        return this.chaptersService.findAllForAdmin(orgId);
    }
    async findOne(id, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.chaptersService.findByIdForAdmin(id, orgId);
    }
    async findByModule(moduleId, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.chaptersService.findByModuleIdForAdmin(moduleId, orgId);
    }
    async create(dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.chaptersService.create(orgId, dto);
    }
    async update(id, dto, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.chaptersService.update(id, orgId, dto);
    }
    async remove(id, actor, req) {
        const orgId = await this.resolveOrgId(actor, req);
        return this.chaptersService.remove(id, orgId);
    }
};
exports.AdminChaptersController = AdminChaptersController;
__decorate([
    (0, common_1.Get)('chapters'),
    (0, swagger_1.ApiOperation)({
        summary: '[Admin] Get all chapters',
        description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of chapters', type: chapter_response_dto_1.ChapterListApiResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission or tenant context', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('chapters/:id'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get chapter by ID', description: 'Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Chapter found', type: chapter_response_dto_1.ChapterApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Chapter not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid chapter ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('modules/:moduleId/chapters'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get chapters by module ID', description: 'Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of chapters for the module', type: chapter_response_dto_1.ChapterListApiResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "findByModule", null);
__decorate([
    (0, common_1.Post)('chapter'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.CHAPTER_CREATE),
    (0, swagger_1.ApiOperation)({
        summary: '[Admin] Create chapter',
        description: 'Creates a new chapter within a module. PLATFORM_OWNER must send x-org-id.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Chapter created', type: chapter_response_dto_1.ChapterApiResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission or tenant context', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chapter_dto_1.CreateChapterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('chapter/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.CHAPTER_UPDATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update chapter', description: 'Partially update a chapter. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Chapter updated', type: chapter_response_dto_1.ChapterApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Chapter not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid chapter ID or validation error', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chapter_dto_1.UpdateChapterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('chapter/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.CHAPTER_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete chapter', description: 'Permanently deletes a chapter. PLATFORM_OWNER must send x-org-id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Chapter deleted', type: chapter_response_dto_1.ChapterApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Chapter not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid chapter ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminChaptersController.prototype, "remove", null);
exports.AdminChaptersController = AdminChaptersController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiExtraModels)(chapter_response_dto_1.ChapterResponseDto, create_chapter_dto_1.CreateChapterDto, update_chapter_dto_1.UpdateChapterDto),
    (0, common_1.Controller)('v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard),
    __metadata("design:paramtypes", [chapters_service_1.ChaptersService,
        organizations_service_1.OrganizationsService])
], AdminChaptersController);
//# sourceMappingURL=admin-chapters.controller.js.map