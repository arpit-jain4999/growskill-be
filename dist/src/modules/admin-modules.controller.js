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
exports.AdminModulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const modules_service_1 = require("./modules.service");
const create_module_dto_1 = require("./dto/create-module.dto");
const update_module_dto_1 = require("./dto/update-module.dto");
const module_response_dto_1 = require("./dto/module-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const permissions_1 = require("../common/constants/permissions");
let AdminModulesController = class AdminModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    async findAll(actor) {
        return this.modulesService.findAllForAdmin(actor.organizationId);
    }
    async findOne(id, actor) {
        return this.modulesService.findByIdForAdmin(id, actor.organizationId);
    }
    async create(dto, actor) {
        return this.modulesService.create(actor.organizationId, dto);
    }
    async update(id, dto, actor) {
        return this.modulesService.update(id, actor.organizationId, dto);
    }
    async remove(id, actor) {
        return this.modulesService.remove(id, actor.organizationId);
    }
};
exports.AdminModulesController = AdminModulesController;
__decorate([
    (0, common_1.Get)('modules'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_READ),
    (0, swagger_1.ApiOperation)({
        summary: '[Admin] Get all modules',
        description: 'Tenant-scoped. Returns all modules (including inactive) for the organisation, sorted by display order.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all modules. Response: `{ success: true, data: ModuleResponseDto[] }`', type: module_response_dto_1.ModuleListApiResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission or tenant context', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('modules/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_READ),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get module by ID', description: 'Tenant-scoped. Returns a single module by ID.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Module found. Response: `{ success: true, data: ModuleResponseDto }`', type: module_response_dto_1.ModuleApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Module not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('module'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_CREATE),
    (0, swagger_1.ApiOperation)({
        summary: '[Admin] Create module',
        description: 'Creates a new content module in the organisation. Optionally link to a course via courseId.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Module created. Response: `{ success: true, data: ModuleResponseDto }`', type: module_response_dto_1.ModuleApiResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission or tenant context', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_module_dto_1.CreateModuleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('module/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_UPDATE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update module', description: 'Partially update a module. Only provided fields are changed.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Module updated. Response: `{ success: true, data: ModuleResponseDto }`', type: module_response_dto_1.ModuleApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Module not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID or validation error', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_module_dto_1.UpdateModuleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('module/:id'),
    (0, common_1.UseGuards)(authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete module', description: 'Permanently deletes a module from the organisation.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Module deleted. Response: `{ success: true, data: ModuleResponseDto }`', type: module_response_dto_1.ModuleApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Module not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "remove", null);
exports.AdminModulesController = AdminModulesController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiExtraModels)(module_response_dto_1.ModuleResponseDto, create_module_dto_1.CreateModuleDto, update_module_dto_1.UpdateModuleDto),
    (0, common_1.Controller)('v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], AdminModulesController);
//# sourceMappingURL=admin-modules.controller.js.map