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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const fs = require("fs");
const path = require("path");
const promises_1 = require("stream/promises");
const file_repository_1 = require("./repositories/file.repository");
const logger_service_1 = require("../common/services/logger.service");
const video_processing_service_1 = require("../video-processing/video-processing.service");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
let FilesService = class FilesService {
    constructor(fileRepository, configService, logger, httpService, videoProcessingService) {
        this.fileRepository = fileRepository;
        this.configService = configService;
        this.logger = logger;
        this.httpService = httpService;
        this.videoProcessingService = videoProcessingService;
        this.uploadSessions = new Map();
        this.logger.setContext('FilesService');
        this.bucketName = this.configService.get('FILE_BUCKET_NAME') || 'skillgroww-files';
    }
    resolvePublicFileBaseUrl() {
        const fb = (this.configService.get('FILE_BASE_URL') ?? '').trim();
        if (fb && !/storage\.example\.com/i.test(fb)) {
            return fb.replace(/\/$/, '');
        }
        const port = this.configService.get('PORT') || 3000;
        return `http://localhost:${port}/uploads`;
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
            chapterId: dto.chapterId,
            moduleId: dto.moduleId,
        });
        return {
            uploadId,
            fileKey,
            signedUrl,
            expiresIn: 3600,
        };
    }
    async generateSignedUrl(fileKey, mimeType) {
        const origin = this.resolveAppOrigin();
        return `${origin}/fake-upload?key=${encodeURIComponent(fileKey)}&mimeType=${encodeURIComponent(mimeType)}`;
    }
    resolveAppOrigin() {
        const fb = (this.configService.get('FILE_BASE_URL') ?? '').trim();
        if (fb && !/storage\.example\.com/i.test(fb)) {
            try {
                return new URL(fb).origin;
            }
            catch {
            }
        }
        const port = this.configService.get('PORT') || 3000;
        return `http://localhost:${port}`;
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
        const publicBase = this.resolvePublicFileBaseUrl();
        const fileInfo = await this.fileRepository.create({
            name: fileName,
            key: dto.fileKey,
            baseUrl: publicBase,
            imgUrl: `${publicBase}/${dto.fileKey}`,
            mimeType: uploadSession.mimeType,
            size: dto.fileSize ? parseInt(dto.fileSize, 10) : undefined,
        });
        const isVideo = uploadSession.mimeType.startsWith('video/');
        let videoProcessingId;
        let hlsMasterUrl;
        if (isVideo) {
            try {
                const result = await this.videoProcessingService.startTranscode({
                    sourceFileId: fileInfo._id.toString(),
                    chapterId: uploadSession.chapterId,
                    moduleId: uploadSession.moduleId,
                });
                videoProcessingId = result.videoProcessingId;
                hlsMasterUrl = result.hlsMasterUrl;
            }
            catch (err) {
                this.logger.error(`Failed to enqueue video processing: ${err?.message}`);
            }
        }
        if (uploadSession.callbackUrl) {
            await this.triggerCallback(uploadSession.callbackUrl, fileInfo, {
                ...(videoProcessingId && { videoProcessingId }),
                ...(hlsMasterUrl && { hlsMasterUrl }),
                ...(isVideo && { videoProcessingStatus: videoProcessingId ? 'pending' : 'failed_to_enqueue' }),
            });
        }
        this.uploadSessions.delete(dto.uploadId);
        return {
            fileId: fileInfo._id.toString(),
            file: fileInfo,
            ...(videoProcessingId && {
                videoProcessingId,
                hlsMasterUrl,
                videoProcessingStatus: 'pending',
            }),
        };
    }
    async triggerCallback(callbackUrl, fileInfo, videoMeta) {
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
                ...videoMeta,
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
    async uploadMultipartDirect(req) {
        if (typeof req.isMultipart !== 'function' || !req.isMultipart()) {
            const ct = String(req.headers['content-type'] ?? '');
            const jsonHint = ct.includes('application/json')
                ? ' You sent application/json; this route does not accept JSON. Send multipart/form-data with a real file binary in a part named "file". Example: curl -F "folder=chapters/videos" -F "chapterId=YOUR_ID" -F "file=@/path/to/video.mp4" -H "Authorization: Bearer TOKEN" http://localhost:8080/v1/files/upload/direct'
                : '';
            throw new common_1.BadRequestException(`Expected multipart/form-data with a part named "file" (binary upload).${jsonHint}`);
        }
        let folder = 'uploads';
        let moduleId;
        let chapterId;
        let wroteFile = false;
        let fileKey = '';
        let originalName = 'upload.bin';
        let mimeType = 'application/octet-stream';
        let size = 0;
        const uploadsRoot = path.join(process.cwd(), 'storage', 'uploads');
        for await (const part of req.parts()) {
            if (part.type === 'field') {
                const v = String(part.value ?? '').trim();
                if (part.fieldname === 'folder' && v)
                    folder = v;
                if (part.fieldname === 'moduleId' && v)
                    moduleId = v;
                if (part.fieldname === 'chapterId' && v)
                    chapterId = v;
            }
            else if (part.type === 'file') {
                if (wroteFile) {
                    part.file.resume();
                    continue;
                }
                originalName = part.filename || originalName;
                mimeType = part.mimetype || mimeType;
                fileKey = this.generateFileKey(originalName, folder);
                const destPath = path.join(uploadsRoot, fileKey);
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
                await (0, promises_1.pipeline)(part.file, fs.createWriteStream(destPath));
                size = fs.statSync(destPath).size;
                wroteFile = true;
            }
        }
        if (!wroteFile || !fileKey) {
            throw new common_1.BadRequestException('No file field received (use field name "file" in multipart)');
        }
        const publicBase = this.resolvePublicFileBaseUrl();
        const storedName = fileKey.split('/').pop() || originalName;
        const fileInfo = await this.fileRepository.create({
            name: storedName,
            key: fileKey,
            baseUrl: publicBase,
            imgUrl: `${publicBase}/${fileKey}`,
            mimeType,
            size,
        });
        const isVideo = mimeType.startsWith('video/');
        let videoProcessingId;
        let hlsMasterUrl;
        if (isVideo) {
            try {
                const result = await this.videoProcessingService.startTranscode({
                    sourceFileId: fileInfo._id.toString(),
                    chapterId,
                    moduleId,
                });
                videoProcessingId = result.videoProcessingId;
                hlsMasterUrl = result.hlsMasterUrl;
            }
            catch (err) {
                this.logger.error(`Failed to enqueue video processing: ${err?.message}`);
            }
        }
        return {
            fileId: fileInfo._id.toString(),
            file: fileInfo,
            ...(videoProcessingId && {
                videoProcessingId,
                hlsMasterUrl,
                videoProcessingStatus: 'pending',
            }),
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
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => video_processing_service_1.VideoProcessingService))),
    __metadata("design:paramtypes", [file_repository_1.FileRepository,
        config_1.ConfigService,
        logger_service_1.LoggerService,
        axios_1.HttpService,
        video_processing_service_1.VideoProcessingService])
], FilesService);
//# sourceMappingURL=files.service.js.map