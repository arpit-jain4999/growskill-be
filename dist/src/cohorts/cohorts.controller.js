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
exports.CohortsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cohorts_service_1 = require("./cohorts.service");
const cohort_response_dto_1 = require("./dto/cohort-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const tenant_context_guard_2 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
let CohortsController = class CohortsController {
    constructor(cohortsService) {
        this.cohortsService = cohortsService;
    }
    async findAll(actor) {
        return this.cohortsService.findAll(actor.organizationId);
    }
    async findOne(id, actor) {
        return this.cohortsService.findById(id, actor.organizationId);
    }
};
exports.CohortsController = CohortsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active cohorts', description: 'Tenant-scoped. Requires cohort:read.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of active cohorts', type: [cohort_response_dto_1.CohortResponseDto] }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CohortsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cohort by ID', description: 'Tenant-scoped. Requires cohort:read.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cohort ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cohort found', type: cohort_response_dto_1.CohortResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cohort not found', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CohortsController.prototype, "findOne", null);
exports.CohortsController = CohortsController = __decorate([
    (0, swagger_1.ApiTags)('Cohorts'),
    (0, common_1.Controller)('v1/cohorts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_2.RequireTenantGuard, authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.COHORT_READ),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [cohorts_service_1.CohortsService])
], CohortsController);
//# sourceMappingURL=cohorts.controller.js.map