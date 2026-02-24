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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const files_service_1 = require("./files.service");
const upload_file_dto_1 = require("./dto/upload-file.dto");
const file_response_dto_1 = require("./dto/file-response.dto");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async initiateUpload(dto) {
        return this.filesService.initiateUpload(dto);
    }
    async completeUpload(dto) {
        return this.filesService.completeUpload(dto);
    }
    async testUpload(dto) {
        return this.filesService.testUpload(dto);
    }
    async getFile(id) {
        return this.filesService.getFileById(id);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload/initiate'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate file upload', description: 'Get signed URL for multipart file upload. Returns upload ID and signed URL.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Upload initiated successfully',
        type: file_response_dto_1.InitiateUploadResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - Invalid or missing JWT token',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Bad request - Invalid file details',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_dto_1.InitiateUploadDto]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "initiateUpload", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('upload/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete file upload', description: 'Complete file upload and save metadata. Called by storage service or client after upload.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Upload completed successfully',
        type: file_response_dto_1.CompleteUploadResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid upload session or file key mismatch',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_dto_1.CompleteUploadDto]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "completeUpload", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload/test'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: '[Testing] Test file upload', description: 'Backend testing endpoint for file upload flow.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Test upload details returned',
        type: file_response_dto_1.TestUploadResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - Invalid or missing JWT token',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_dto_1.TestUploadDto]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "testUpload", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file by ID', description: 'Get file metadata by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'File ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'File found',
        type: file_response_dto_1.FileInfoResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'File not found',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - Invalid or missing JWT token',
        type: error_response_dto_1.StandardErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFile", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('Files'),
    (0, common_1.Controller)('v1/files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map