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
exports.ChaptersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chapters_service_1 = require("./chapters.service");
const chapter_response_dto_1 = require("./dto/chapter-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
let ChaptersController = class ChaptersController {
    constructor(chaptersService) {
        this.chaptersService = chaptersService;
    }
    async findAll() {
        return this.chaptersService.findAll();
    }
    async findOne(id) {
        return this.chaptersService.findById(id);
    }
    async findByModule(moduleId) {
        return this.chaptersService.findByModuleId(moduleId);
    }
};
exports.ChaptersController = ChaptersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active chapters', description: 'Any authenticated user in the org can read.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of active chapters', type: chapter_response_dto_1.ChapterListApiResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChaptersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chapter by ID', description: 'Any authenticated user in the org can read.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Chapter found', type: chapter_response_dto_1.ChapterApiResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Chapter not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid chapter ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChaptersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('module/:moduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chapters by module ID', description: 'Returns all active chapters for a module, sorted by order. Any authenticated user in the org can read.' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'Module ID (MongoDB ObjectId)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of chapters for the module', type: chapter_response_dto_1.ChapterListApiResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid module ID', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChaptersController.prototype, "findByModule", null);
exports.ChaptersController = ChaptersController = __decorate([
    (0, swagger_1.ApiTags)('Chapters'),
    (0, swagger_1.ApiExtraModels)(chapter_response_dto_1.ChapterResponseDto),
    (0, common_1.Controller)('v1/chapters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard, tenant_context_guard_1.RequireTenantGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [chapters_service_1.ChaptersService])
], ChaptersController);
//# sourceMappingURL=chapters.controller.js.map