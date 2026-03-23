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
exports.VideoProcessingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("mongoose");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const https = require("https");
const http = require("http");
const video_processing_repository_1 = require("./repositories/video-processing.repository");
const file_repository_1 = require("../files/repositories/file.repository");
const chapter_repository_1 = require("../chapters/repositories/chapter.repository");
const module_repository_1 = require("../modules/repositories/module.repository");
const logger_service_1 = require("../common/services/logger.service");
const video_processing_schema_1 = require("./schemas/video-processing.schema");
const s3_storage_service_1 = require("../files/s3-storage.service");
const local_media_paths_1 = require("../common/utils/local-media-paths");
const url_normalize_1 = require("../common/utils/url-normalize");
const storage_public_base_url_1 = require("../common/utils/storage-public-base-url");
let VideoProcessingService = class VideoProcessingService {
    constructor(videoProcessingRepo, fileRepository, chapterRepository, moduleRepository, configService, logger, s3Storage) {
        this.videoProcessingRepo = videoProcessingRepo;
        this.fileRepository = fileRepository;
        this.chapterRepository = chapterRepository;
        this.moduleRepository = moduleRepository;
        this.configService = configService;
        this.logger = logger;
        this.s3Storage = s3Storage;
        this.logger.setContext('VideoProcessingService');
    }
    async startTranscode(params) {
        const { sourceFileId, chapterId, moduleId } = params;
        if (!sourceFileId || !mongoose_1.Types.ObjectId.isValid(sourceFileId)) {
            throw new common_1.BadRequestException('Invalid sourceFileId');
        }
        if (chapterId && !mongoose_1.Types.ObjectId.isValid(chapterId)) {
            throw new common_1.BadRequestException('Invalid chapterId');
        }
        if (moduleId && !mongoose_1.Types.ObjectId.isValid(moduleId)) {
            throw new common_1.BadRequestException('Invalid moduleId');
        }
        const record = await this.videoProcessingRepo.create({
            sourceFileId: new mongoose_1.Types.ObjectId(sourceFileId),
            status: video_processing_schema_1.VIDEO_PROCESSING_STATUS.PENDING,
            chapterId: chapterId ? new mongoose_1.Types.ObjectId(chapterId) : undefined,
            moduleId: moduleId ? new mongoose_1.Types.ObjectId(moduleId) : undefined,
        });
        const videoProcessingId = record._id.toString();
        const hlsMasterUrl = this.getPublicMasterPlaylistUrl(videoProcessingId);
        this.logger.log(`Starting video processing ${videoProcessingId} for file ${sourceFileId}`);
        this.runTranscode(videoProcessingId, sourceFileId, chapterId, moduleId).catch((err) => {
            this.logger.error(`Background transcode failed for ${videoProcessingId}: ${err?.message}`, err?.stack);
        });
        return { videoProcessingId, hlsMasterUrl };
    }
    getPublicMasterPlaylistUrl(videoProcessingId) {
        return this.resolveMasterPlaylistUrl(videoProcessingId);
    }
    async runTranscode(videoProcessingId, sourceFileId, chapterId, moduleId) {
        const record = await this.videoProcessingRepo.findById(videoProcessingId);
        if (!record) {
            this.logger.error(`VideoProcessing not found: ${videoProcessingId}`);
            return;
        }
        await this.videoProcessingRepo.updateStatus(videoProcessingId, video_processing_schema_1.VIDEO_PROCESSING_STATUS.PROCESSING);
        const fileInfo = await this.fileRepository.findById(sourceFileId);
        if (!fileInfo) {
            await this.videoProcessingRepo.updateStatus(videoProcessingId, video_processing_schema_1.VIDEO_PROCESSING_STATUS.FAILED, {
                errorMessage: 'Source file not found',
            });
            return;
        }
        const sourceUrl = fileInfo.imgUrl || `${fileInfo.baseUrl}/${fileInfo.key}`;
        const outputDir = this.getOutputDir(videoProcessingId);
        const tempDir = path.join(outputDir, '..', `temp_${videoProcessingId}`);
        const tempFile = path.join(tempDir, 'source');
        try {
            fs.mkdirSync(tempDir, { recursive: true });
            fs.mkdirSync(outputDir, { recursive: true });
            await this.resolveSourceVideoToTemp(fileInfo.key, sourceUrl, tempFile);
            await this.runFfmpegHls(tempFile, outputDir);
            const masterUrl = this.resolveMasterPlaylistUrl(videoProcessingId);
            if (this.shouldPublishHlsToS3()) {
                await this.uploadHlsArtifactsToS3(videoProcessingId, outputDir);
                if (this.shouldDeleteLocalHlsAfterS3()) {
                    try {
                        fs.rmSync(outputDir, { recursive: true, force: true });
                    }
                    catch (rmErr) {
                        this.logger.warn(`Could not remove local HLS dir ${outputDir}: ${rmErr?.message}`);
                    }
                }
            }
            await this.videoProcessingRepo.updateStatus(videoProcessingId, video_processing_schema_1.VIDEO_PROCESSING_STATUS.COMPLETED, {
                masterPlaylistUrl: masterUrl,
            });
            if (chapterId) {
                const chapter = await this.chapterRepository.findById(chapterId);
                if (chapter) {
                    const orgId = chapter.organizationId?.toString?.() ?? '';
                    if (orgId) {
                        await this.chapterRepository.update(chapterId, orgId, {
                            videoUrl: masterUrl,
                            contentType: 'video',
                        });
                        this.logger.log(`Updated chapter ${chapterId} with videoUrl`);
                    }
                }
            }
            if (moduleId) {
                const mod = await this.moduleRepository.findById(moduleId);
                if (mod) {
                    const orgId = mod.organizationId?.toString?.() ?? '';
                    if (orgId) {
                        await this.moduleRepository.update(moduleId, orgId, {
                            videoUrl: masterUrl,
                        });
                        this.logger.log(`Updated module ${moduleId} with HLS videoUrl`);
                    }
                }
            }
        }
        catch (err) {
            this.logger.error(`Video processing failed: ${err?.message}`, err?.stack);
            await this.videoProcessingRepo.updateStatus(videoProcessingId, video_processing_schema_1.VIDEO_PROCESSING_STATUS.FAILED, {
                errorMessage: err?.message || 'Transcoding failed',
            });
        }
        finally {
            if (fs.existsSync(tempDir)) {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
        }
    }
    getOutputDir(videoProcessingId) {
        const base = (0, local_media_paths_1.resolveHlsOutputRoot)(this.configService.get('VIDEO_HLS_OUTPUT_DIR'));
        return path.join(base, videoProcessingId);
    }
    resolveMasterPlaylistUrl(videoProcessingId) {
        if (this.shouldPublishHlsToS3()) {
            const explicit = (this.configService.get('HLS_S3_PUBLIC_BASE_URL') ?? '').trim();
            const baseRaw = explicit && !/storage\.example\.com/i.test(explicit)
                ? (0, url_normalize_1.normalizePublicBaseUrl)(explicit)
                : (0, storage_public_base_url_1.resolvePublicFileStorageBaseUrl)((k) => this.configService.get(k), true, this.s3Storage.getBucket());
            const base = baseRaw.replace(/\/$/, '');
            const prefix = this.getHlsS3KeyPrefix();
            return `${base}/${prefix}/${videoProcessingId}/master.m3u8`;
        }
        const explicit = (this.configService.get('HLS_PUBLIC_BASE_URL') ?? '').trim() ||
            (this.configService.get('PUBLIC_APP_URL') ?? '').trim();
        const fb = explicit && !/storage\.example\.com/i.test(explicit) ? explicit : '';
        const port = this.configService.get('PORT') || 3000;
        const baseUrl = fb ? (0, url_normalize_1.normalizePublicBaseUrl)(fb) : `http://localhost:${port}`;
        const base = baseUrl.replace(/\/$/, '');
        return `${base}/hls/${videoProcessingId}/master.m3u8`;
    }
    shouldPublishHlsToS3() {
        if (!this.s3Storage.isEnabled())
            return false;
        const v = (this.configService.get('HLS_UPLOAD_TO_S3') ?? '').trim().toLowerCase();
        return v !== 'false' && v !== '0' && v !== 'no';
    }
    shouldDeleteLocalHlsAfterS3() {
        const v = (this.configService.get('HLS_DELETE_LOCAL_AFTER_S3_UPLOAD') ?? '').trim().toLowerCase();
        return v !== 'false' && v !== '0' && v !== 'no';
    }
    getHlsS3KeyPrefix() {
        const p = (this.configService.get('HLS_S3_KEY_PREFIX') ?? 'hls')
            .trim()
            .replace(/^\/+|\/+$/g, '');
        return p || 'hls';
    }
    contentTypeForHlsFile(fileName) {
        const lower = fileName.toLowerCase();
        if (lower.endsWith('.m3u8'))
            return 'application/vnd.apple.mpegurl';
        if (lower.endsWith('.ts'))
            return 'video/mp2t';
        return 'application/octet-stream';
    }
    cacheControlForHlsFile(fileName) {
        return fileName.toLowerCase().endsWith('.m3u8')
            ? 'public, max-age=5'
            : 'public, max-age=31536000, immutable';
    }
    async uploadHlsArtifactsToS3(videoProcessingId, outputDir) {
        const prefix = this.getHlsS3KeyPrefix();
        const entries = fs.readdirSync(outputDir, { withFileTypes: true });
        const files = entries.filter((e) => e.isFile()).map((e) => e.name);
        if (files.length === 0) {
            throw new Error('No HLS output files to upload');
        }
        const sorted = files.sort((a, b) => {
            if (a === 'master.m3u8')
                return 1;
            if (b === 'master.m3u8')
                return -1;
            return a.localeCompare(b);
        });
        for (const name of sorted) {
            const full = path.join(outputDir, name);
            const key = `${prefix}/${videoProcessingId}/${name}`;
            const contentType = this.contentTypeForHlsFile(name);
            const cacheControl = this.cacheControlForHlsFile(name);
            await this.s3Storage.uploadLocalFile(key, full, contentType, cacheControl);
        }
        this.logger.log(`HLS uploaded: s3://${this.s3Storage.getBucket()}/${prefix}/${videoProcessingId}/ (${sorted.length} files)`);
    }
    async resolveSourceVideoToTemp(fileKey, sourceUrl, tempFile) {
        const uploadsRoot = (0, local_media_paths_1.resolveLocalUploadsRoot)(this.configService.get('LOCAL_UPLOADS_ROOT'));
        const safeParts = fileKey
            .replace(/^\/+/, '')
            .split(/[/\\]+/)
            .filter((p) => p.length > 0 && p !== '..' && p !== '.');
        const localPath = path.join(uploadsRoot, ...safeParts);
        if (fs.existsSync(localPath)) {
            await fs.promises.copyFile(localPath, tempFile);
            this.logger.log(`Transcode source: local file ${localPath}`);
            return;
        }
        if (this.s3Storage.isEnabled()) {
            try {
                await this.s3Storage.getObjectToFile(fileKey, tempFile);
                this.logger.log(`Transcode source: S3 GetObject ${fileKey}`);
                return;
            }
            catch (err) {
                this.logger.warn(`S3 GetObject failed for key "${fileKey}", falling back to HTTP download: ${err?.message}`);
            }
        }
        await this.downloadFile(sourceUrl, tempFile);
    }
    resolveAbsoluteUrlForDownload(raw) {
        const s = (raw ?? '').trim();
        if (!s) {
            throw new Error('Source video URL is empty — ensure FileInfo has a valid baseUrl/imgUrl (e.g. set FILE_BASE_URL or use S3 public URL).');
        }
        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(s) && !s.startsWith('/')) {
            try {
                return (0, url_normalize_1.ensureAbsoluteHttpUrl)(s);
            }
            catch {
            }
        }
        try {
            return new URL(s).href;
        }
        catch {
            const port = this.configService.get('PORT') || 3000;
            const appBase = (this.configService.get('PUBLIC_APP_URL') ?? '').trim() ||
                (this.configService.get('HLS_PUBLIC_BASE_URL') ?? '').trim() ||
                `http://localhost:${port}`;
            const origin = appBase.replace(/\/$/, '');
            const pathPart = s.startsWith('/') ? s : `/${s}`;
            try {
                return new URL(pathPart, `${origin}/`).href;
            }
            catch {
                throw new Error(`Invalid source URL: ${s.slice(0, 200)}`);
            }
        }
    }
    resolveRedirectUrl(location, currentUrl) {
        const loc = (location ?? '').trim();
        try {
            return new URL(loc).href;
        }
        catch {
            return new URL(loc, currentUrl).href;
        }
    }
    downloadFile(url, destPath) {
        const absoluteUrl = this.resolveAbsoluteUrlForDownload(url);
        return new Promise((resolve, reject) => {
            const protocol = absoluteUrl.startsWith('https') ? https : http;
            const file = fs.createWriteStream(destPath);
            protocol
                .get(absoluteUrl, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    const redirect = response.headers.location;
                    if (redirect) {
                        file.close();
                        fs.unlinkSync(destPath);
                        const nextUrl = this.resolveRedirectUrl(redirect, absoluteUrl);
                        this.downloadFile(nextUrl, destPath).then(resolve).catch(reject);
                        return;
                    }
                }
                if (response.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(destPath);
                    reject(new Error(`Download failed: HTTP ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            })
                .on('error', (err) => {
                file.close();
                if (fs.existsSync(destPath))
                    fs.unlinkSync(destPath);
                reject(err);
            });
        });
    }
    runFfmpegHls(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            const args = [
                '-y',
                '-i',
                inputPath,
                '-map', '0:v:0', '-map', '0:a:0', '-map', '0:v:0', '-map', '0:a:0', '-map', '0:v:0', '-map', '0:a:0',
                '-map', '0:v:0', '-map', '0:a:0',
                '-c:v', 'libx264', '-profile:v', 'main', '-crf', '20', '-sc_threshold', '0', '-g', '48', '-keyint_min', '48',
                '-c:a', 'aac', '-ar', '48000',
                '-filter:v:0', 'scale=w=-2:h=240', '-maxrate:v:0', '400k', '-bufsize:v:0', '800k', '-b:a:0', '96k',
                '-filter:v:1', 'scale=w=-2:h=360', '-maxrate:v:1', '856k', '-bufsize:v:1', '1712k', '-b:a:1', '96k',
                '-filter:v:2', 'scale=w=-2:h=480', '-maxrate:v:2', '1498k', '-bufsize:v:2', '2996k', '-b:a:2', '128k',
                '-filter:v:3', 'scale=w=-2:h=688', '-maxrate:v:3', '2500k', '-bufsize:v:3', '5000k', '-b:a:3', '128k',
                '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3',
                '-hls_time', '4',
                '-hls_list_size', '0',
                '-master_pl_name', 'master.m3u8',
                '-hls_segment_filename', path.join(outputDir, 'stream_%v_%03d.ts'),
                path.join(outputDir, 'stream_%v.m3u8'),
            ];
            const ffmpegPath = this.configService.get('FFMPEG_PATH') || 'ffmpeg';
            const proc = (0, child_process_1.spawn)(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
            let stderr = '';
            proc.stderr?.on('data', (chunk) => {
                stderr += chunk.toString();
            });
            proc.on('close', (code) => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
            });
            proc.on('error', (err) => reject(err));
        });
    }
    async getStatus(videoProcessingId) {
        if (!videoProcessingId || !mongoose_1.Types.ObjectId.isValid(videoProcessingId)) {
            throw new common_1.BadRequestException('Invalid videoProcessingId');
        }
        const record = await this.videoProcessingRepo.findById(videoProcessingId);
        if (!record) {
            throw new common_1.NotFoundException('Video processing not found');
        }
        const doc = record;
        return {
            videoProcessingId: record._id.toString(),
            status: record.status,
            masterPlaylistUrl: record.masterPlaylistUrl ?? null,
            chapterId: record.chapterId?.toString() ?? null,
            moduleId: record.moduleId?.toString() ?? null,
            errorMessage: record.errorMessage ?? null,
            durationSeconds: record.durationSeconds ?? null,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.VideoProcessingService = VideoProcessingService;
exports.VideoProcessingService = VideoProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [video_processing_repository_1.VideoProcessingRepository,
        file_repository_1.FileRepository,
        chapter_repository_1.ChapterRepository,
        module_repository_1.ModuleRepository,
        config_1.ConfigService,
        logger_service_1.LoggerService,
        s3_storage_service_1.S3StorageService])
], VideoProcessingService);
//# sourceMappingURL=video-processing.service.js.map