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
exports.AdminCohortsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cohorts_service_1 = require("./cohorts.service");
const create_cohort_dto_1 = require("./dto/create-cohort.dto");
const update_cohort_dto_1 = require("./dto/update-cohort.dto");
const cohort_response_dto_1 = require("./dto/cohort-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const tenant_context_guard_2 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
let AdminCohortsController = class AdminCohortsController {
    constructor(cohortsService) {
        this.cohortsService = cohortsService;
    }
    async findAllForAdmin(actor) {
        return this.cohortsService.findAllForAdmin(actor.organizationId);
    }
    async findOneForAdmin(id, actor) {
        return this.cohortsService.findByIdForAdmin(id, actor.organizationId);
    }
    async create(createCohortDto, actor) {
        return this.cohortsService.create(actor.organizationId, createCohortDto);
    }
    async update(id, updateCohortDto, actor) {
        return this.cohortsService.update(id, actor.organizationId, updateCohortDto);
    }
    async remove(id, actor) {
        return this.cohortsService.remove(id, actor.organizationId);
    }
};
exports.AdminCohortsController = AdminCohortsController;
__decorate([
    (0, common_1.Get)('cohorts'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_READ),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all cohorts', description: 'Tenant-scoped. Requires cohort:read.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all cohorts', type: [cohort_response_dto_1.CohortResponseDto] }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCohortsController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Get)('cohorts/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_READ),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get cohort by ID', description: 'Tenant-scoped. Requires cohort:read.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cohort ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cohort found', type: cohort_response_dto_1.CohortResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cohort not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCohortsController.prototype, "findOneForAdmin", null);
__decorate([
    (0, common_1.Post)('cohort'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_CREATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create cohort', description: 'Tenant-scoped. Requires cohort:create.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Cohort created', type: cohort_response_dto_1.CohortResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cohort_dto_1.CreateCohortDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCohortsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('cohort/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_UPDATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update cohort', description: 'Tenant-scoped. Requires cohort:update.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cohort ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cohort updated', type: cohort_response_dto_1.CohortResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cohort not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cohort_dto_1.UpdateCohortDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCohortsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('cohort/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Soft delete cohort', description: 'Tenant-scoped. Requires cohort:delete.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cohort ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cohort deleted', type: cohort_response_dto_1.CohortResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cohort not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Cohort already inactive', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCohortsController.prototype, "remove", null);
exports.AdminCohortsController = AdminCohortsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_2.RequireTenantGuard),
    __metadata("design:paramtypes", [cohorts_service_1.CohortsService])
], AdminCohortsController);
//# sourceMappingURL=admin-cohorts.controller.js.map