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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const file_repository_1 = require("./repositories/file.repository");
const logger_service_1 = require("../common/services/logger.service");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
let FilesService = class FilesService {
    constructor(fileRepository, configService, logger, httpService) {
        this.fileRepository = fileRepository;
        this.configService = configService;
        this.logger = logger;
        this.httpService = httpService;
        this.uploadSessions = new Map();
        this.logger.setContext('FilesService');
        this.baseUrl = this.configService.get('FILE_BASE_URL') || 'https://storage.example.com';
        this.bucketName = this.configService.get('FILE_BUCKET_NAME') || 'skillgroww-files';
    }
    generateFileKey(fileName, folder) {
        const timestamp = Date.now();
        const uuid = (0, crypto_1.randomUUID)().split('-')[0];
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const basePath = folder || 'uploads';
        return `${basePath}/${timestamp}_${uuid}_${sanitizedFileName}`;
    }
    async initiateUpload(dto) {
        this.logger.log(`Initiating upload for file: ${dto.fileName}`);
        const fileKey = this.generateFileKey(dto.fileName, dto.folder);
        const uploadId = (0, crypto_1.randomUUID)();
        const signedUrl = await this.generateSignedUrl(fileKey, dto.mimeType);
        this.uploadSessions.set(uploadId, {
            fileKey,
            mimeType: dto.mimeType,
            callbackUrl: dto.callbackUrl,
        });
        return {
            uploadId,
            fileKey,
            signedUrl,
            expiresIn: 3600,
        };
    }
    async generateSignedUrl(fileKey, mimeType) {
        const baseUrl = this.baseUrl;
        return `${baseUrl}/upload?key=${fileKey}&mimeType=${mimeType}`;
    }
    async completeUpload(dto) {
        this.logger.log(`Completing upload: ${dto.uploadId}, key: ${dto.fileKey}`);
        const uploadSession = this.uploadSessions.get(dto.uploadId);
        if (!uploadSession) {
            throw new common_1.BadRequestException('Invalid upload session');
        }
        if (uploadSession.fileKey !== dto.fileKey) {
            throw new common_1.BadRequestException('File key mismatch');
        }
        const fileName = dto.fileKey.split('/').pop() || 'file';
        const fileInfo = await this.fileRepository.create({
            name: fileName,
            key: dto.fileKey,
            baseUrl: this.baseUrl,
            imgUrl: `${this.baseUrl}/${dto.fileKey}`,
            mimeType: uploadSession.mimeType,
            size: dto.fileSize ? parseInt(dto.fileSize, 10) : undefined,
        });
        if (uploadSession.callbackUrl) {
            await this.triggerCallback(uploadSession.callbackUrl, fileInfo);
        }
        this.uploadSessions.delete(dto.uploadId);
        return {
            fileId: fileInfo._id.toString(),
            file: fileInfo,
        };
    }
    async triggerCallback(callbackUrl, fileInfo) {
        try {
            this.logger.log(`Triggering callback to: ${callbackUrl}`);
            const callbackData = {
                success: true,
                file: {
                    _id: fileInfo._id.toString(),
                    name: fileInfo.name,
                    key: fileInfo.key,
                    baseUrl: fileInfo.baseUrl,
                    imgUrl: fileInfo.imgUrl,
                    mimeType: fileInfo.mimeType,
                    size: fileInfo.size,
                    createdAt: fileInfo.createdAt,
                    updatedAt: fileInfo.updatedAt,
                },
            };
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(callbackUrl, callbackData, {
                timeout: 5000,
            }));
            this.logger.log(`Callback triggered successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to trigger callback: ${error.message}`, error.stack);
        }
    }
    async testUpload(dto) {
        this.logger.log(`Testing file upload for: ${dto.fileName}`);
        const initiateResult = await this.initiateUpload({
            fileName: dto.fileName,
            mimeType: dto.mimeType,
            folder: dto.folder,
        });
        this.logger.log(`Test upload initiated. Upload file to: ${initiateResult.signedUrl}`);
        return {
            uploadId: initiateResult.uploadId,
            fileKey: initiateResult.fileKey,
            signedUrl: initiateResult.signedUrl,
            message: 'Upload initiated. Use the complete endpoint to finish the upload.',
            completeEndpoint: `/files/upload/complete`,
            completePayload: {
                uploadId: initiateResult.uploadId,
                fileKey: initiateResult.fileKey,
            },
        };
    }
    async getFileById(fileId) {
        const file = await this.fileRepository.findById(fileId);
        if (!file) {
            throw new common_1.BadRequestException('File not found');
        }
        return file;
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_repository_1.FileRepository,
        config_1.ConfigService,
        logger_service_1.LoggerService,
        axios_1.HttpService])
], FilesService);
//# sourceMappingURL=files.service.js.map