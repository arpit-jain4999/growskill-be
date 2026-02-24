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
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const modules_service_1 = require("./modules.service");
const module_response_dto_1 = require("./dto/module-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const authorize_decorator_1 = require("../common/decorators/authorize.decorator");
const permissions_1 = require("../common/constants/permissions");
let ModulesController = class ModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    async findAll() {
        return this.modulesService.findAll();
    }
    async findOne(id) {
        return this.modulesService.findById(id);
    }
    async findByCourse(courseId) {
        return this.modulesService.findByCourseId(courseId);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active modules',
        description: 'Returns all active modules sorted by display order. Requires module:read permission.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of active modules', type: module_response_dto_1.ModuleListApiResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get module by ID', description: 'Returns a single module by its ID. Requires module:read.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Module ID (MongoDB ObjectId)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Module found', type: module_response_dto_1.ModuleApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Module not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modules by course ID', description: 'Returns all active modules for a given course, sorted by display order. Requires module:read.' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID (MongoDB ObjectId)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of modules for the course', type: module_response_dto_1.ModuleListApiResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid course ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findByCourse", null);
exports.ModulesController = ModulesController = __decorate([
    (0, swagger_1.ApiTags)('Modules'),
    (0, swagger_1.ApiExtraModels)(module_response_dto_1.ModuleResponseDto),
    (0, common_1.Controller)('v1/modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard, authorize_guard_1.AuthorizeGuard),
    (0, authorize_decorator_1.Authorize)(permissions_1.PERMISSIONS.MODULE_READ),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map