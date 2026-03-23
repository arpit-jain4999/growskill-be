import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import * as https from 'https';
import * as http from 'http';
import { VideoProcessingRepository } from './repositories/video-processing.repository';
import { FileRepository } from '../files/repositories/file.repository';
import { ChapterRepository } from '../chapters/repositories/chapter.repository';
import { ModuleRepository } from '../modules/repositories/module.repository';
import { LoggerService } from '../common/services/logger.service';
import { VIDEO_PROCESSING_STATUS } from './schemas/video-processing.schema';
import { S3StorageService } from '../files/s3-storage.service';
import { resolveHlsOutputRoot, resolveLocalUploadsRoot } from '../common/utils/local-media-paths';
import { ensureAbsoluteHttpUrl, normalizePublicBaseUrl } from '../common/utils/url-normalize';
import { resolvePublicFileStorageBaseUrl } from '../common/utils/storage-public-base-url';

@Injectable()
export class VideoProcessingService {
  constructor(
    private readonly videoProcessingRepo: VideoProcessingRepository,
    private readonly fileRepository: FileRepository,
    private readonly chapterRepository: ChapterRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly s3Storage: S3StorageService,
  ) {
    this.logger.setContext('VideoProcessingService');
  }

  /**
   * Create a video processing record and run transcoding in the background.
   * Called by FilesService when a video upload completes.
   * Optional chapterId and/or moduleId: on success, HLS URL is written to that chapter or module.
   */
  async startTranscode(params: {
    sourceFileId: string;
    chapterId?: string;
    moduleId?: string;
  }): Promise<{ videoProcessingId: string; hlsMasterUrl: string }> {
    const { sourceFileId, chapterId, moduleId } = params;
    if (!sourceFileId || !Types.ObjectId.isValid(sourceFileId)) {
      throw new BadRequestException('Invalid sourceFileId');
    }
    if (chapterId && !Types.ObjectId.isValid(chapterId)) {
      throw new BadRequestException('Invalid chapterId');
    }
    if (moduleId && !Types.ObjectId.isValid(moduleId)) {
      throw new BadRequestException('Invalid moduleId');
    }
    const record = await this.videoProcessingRepo.create({
      sourceFileId: new Types.ObjectId(sourceFileId),
      status: VIDEO_PROCESSING_STATUS.PENDING,
      chapterId: chapterId ? new Types.ObjectId(chapterId) : undefined,
      moduleId: moduleId ? new Types.ObjectId(moduleId) : undefined,
    });
    const videoProcessingId = record._id.toString();
    const hlsMasterUrl = this.getPublicMasterPlaylistUrl(videoProcessingId);
    this.logger.log(`Starting video processing ${videoProcessingId} for file ${sourceFileId}`);

    // Run transcoding in background (no queue – same process)
    this.runTranscode(videoProcessingId, sourceFileId, chapterId, moduleId).catch((err) => {
      this.logger.error(`Background transcode failed for ${videoProcessingId}: ${err?.message}`, err?.stack);
    });

    return { videoProcessingId, hlsMasterUrl };
  }

  /**
   * Public HLS master playlist URL for this processing job (stable before transcoding finishes).
   * Set HLS_PUBLIC_BASE_URL or PUBLIC_APP_URL so this matches where /hls is served (e.g. API or CloudFront).
   */
  getPublicMasterPlaylistUrl(videoProcessingId: string): string {
    return this.resolveMasterPlaylistUrl(videoProcessingId);
  }

  /**
   * Run HLS transcoding and update chapter and/or module when done.
   */
  private async runTranscode(
    videoProcessingId: string,
    sourceFileId: string,
    chapterId?: string,
    moduleId?: string,
  ): Promise<void> {
    const record = await this.videoProcessingRepo.findById(videoProcessingId);
    if (!record) {
      this.logger.error(`VideoProcessing not found: ${videoProcessingId}`);
      return;
    }

    await this.videoProcessingRepo.updateStatus(videoProcessingId, VIDEO_PROCESSING_STATUS.PROCESSING);

    const fileInfo = await this.fileRepository.findById(sourceFileId);
    if (!fileInfo) {
      await this.videoProcessingRepo.updateStatus(videoProcessingId, VIDEO_PROCESSING_STATUS.FAILED, {
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
          } catch (rmErr: any) {
            this.logger.warn(`Could not remove local HLS dir ${outputDir}: ${rmErr?.message}`);
          }
        }
      }
      await this.videoProcessingRepo.updateStatus(videoProcessingId, VIDEO_PROCESSING_STATUS.COMPLETED, {
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
    } catch (err: any) {
      this.logger.error(`Video processing failed: ${err?.message}`, err?.stack);
      await this.videoProcessingRepo.updateStatus(videoProcessingId, VIDEO_PROCESSING_STATUS.FAILED, {
        errorMessage: err?.message || 'Transcoding failed',
      });
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  private getOutputDir(videoProcessingId: string): string {
    const base = resolveHlsOutputRoot(this.configService.get<string>('VIDEO_HLS_OUTPUT_DIR'));
    return path.join(base, videoProcessingId);
  }

  /**
   * When S3 is enabled, HLS objects are uploaded under `{HLS_S3_KEY_PREFIX}/{videoProcessingId}/`
   * and the master URL uses FILE_BASE_URL (or S3 virtual host) unless HLS_S3_PUBLIC_BASE_URL is set.
   * Local-only mode: serve from this API at /hls/... using HLS_PUBLIC_BASE_URL or PUBLIC_APP_URL.
   */
  private resolveMasterPlaylistUrl(videoProcessingId: string): string {
    if (this.shouldPublishHlsToS3()) {
      const explicit = (this.configService.get<string>('HLS_S3_PUBLIC_BASE_URL') ?? '').trim();
      const baseRaw =
        explicit && !/storage\.example\.com/i.test(explicit)
          ? normalizePublicBaseUrl(explicit)
          : resolvePublicFileStorageBaseUrl(
              (k) => this.configService.get(k),
              true,
              this.s3Storage.getBucket(),
            );
      const base = baseRaw.replace(/\/$/, '');
      const prefix = this.getHlsS3KeyPrefix();
      return `${base}/${prefix}/${videoProcessingId}/master.m3u8`;
    }
    const explicit =
      (this.configService.get<string>('HLS_PUBLIC_BASE_URL') ?? '').trim() ||
      (this.configService.get<string>('PUBLIC_APP_URL') ?? '').trim();
    const fb = explicit && !/storage\.example\.com/i.test(explicit) ? explicit : '';
    const port = this.configService.get<number>('PORT') || 3000;
    const baseUrl = fb ? normalizePublicBaseUrl(fb) : `http://localhost:${port}`;
    const base = baseUrl.replace(/\/$/, '');
    return `${base}/hls/${videoProcessingId}/master.m3u8`;
  }

  /** Upload transcoded HLS to the same S3 bucket as uploads (unless disabled). */
  private shouldPublishHlsToS3(): boolean {
    if (!this.s3Storage.isEnabled()) return false;
    const v = (this.configService.get<string>('HLS_UPLOAD_TO_S3') ?? '').trim().toLowerCase();
    return v !== 'false' && v !== '0' && v !== 'no';
  }

  private shouldDeleteLocalHlsAfterS3(): boolean {
    const v = (this.configService.get<string>('HLS_DELETE_LOCAL_AFTER_S3_UPLOAD') ?? '').trim().toLowerCase();
    return v !== 'false' && v !== '0' && v !== 'no';
  }

  private getHlsS3KeyPrefix(): string {
    const p = (this.configService.get<string>('HLS_S3_KEY_PREFIX') ?? 'hls')
      .trim()
      .replace(/^\/+|\/+$/g, '');
    return p || 'hls';
  }

  private contentTypeForHlsFile(fileName: string): string {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (lower.endsWith('.ts')) return 'video/mp2t';
    return 'application/octet-stream';
  }

  private cacheControlForHlsFile(fileName: string): string {
    return fileName.toLowerCase().endsWith('.m3u8')
      ? 'public, max-age=5'
      : 'public, max-age=31536000, immutable';
  }

  private async uploadHlsArtifactsToS3(videoProcessingId: string, outputDir: string): Promise<void> {
    const prefix = this.getHlsS3KeyPrefix();
    const entries = fs.readdirSync(outputDir, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    if (files.length === 0) {
      throw new Error('No HLS output files to upload');
    }
    const sorted = files.sort((a, b) => {
      if (a === 'master.m3u8') return 1;
      if (b === 'master.m3u8') return -1;
      return a.localeCompare(b);
    });
    for (const name of sorted) {
      const full = path.join(outputDir, name);
      const key = `${prefix}/${videoProcessingId}/${name}`;
      const contentType = this.contentTypeForHlsFile(name);
      const cacheControl = this.cacheControlForHlsFile(name);
      await this.s3Storage.uploadLocalFile(key, full, contentType, cacheControl);
    }
    this.logger.log(
      `HLS uploaded: s3://${this.s3Storage.getBucket()}/${prefix}/${videoProcessingId}/ (${sorted.length} files)`,
    );
  }

  /** Prefer on-disk file under local uploads root (direct upload); otherwise HTTP(S) from imgUrl. */
  private async resolveSourceVideoToTemp(fileKey: string, sourceUrl: string, tempFile: string): Promise<void> {
    const uploadsRoot = resolveLocalUploadsRoot(this.configService.get<string>('LOCAL_UPLOADS_ROOT'));
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
      } catch (err: any) {
        this.logger.warn(
          `S3 GetObject failed for key "${fileKey}", falling back to HTTP download: ${err?.message}`,
        );
      }
    }
    await this.downloadFile(sourceUrl, tempFile);
  }

  /**
   * Node http(s).get requires an absolute URL. DB rows may store relative paths if baseUrl was wrong.
   */
  private resolveAbsoluteUrlForDownload(raw: string): string {
    const s = (raw ?? '').trim();
    if (!s) {
      throw new Error(
        'Source video URL is empty — ensure FileInfo has a valid baseUrl/imgUrl (e.g. set FILE_BASE_URL or use S3 public URL).',
      );
    }
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(s) && !s.startsWith('/')) {
      try {
        return ensureAbsoluteHttpUrl(s);
      } catch {
        /* fall through */
      }
    }
    try {
      return new URL(s).href;
    } catch {
      const port = this.configService.get<number>('PORT') || 3000;
      const appBase =
        (this.configService.get<string>('PUBLIC_APP_URL') ?? '').trim() ||
        (this.configService.get<string>('HLS_PUBLIC_BASE_URL') ?? '').trim() ||
        `http://localhost:${port}`;
      const origin = appBase.replace(/\/$/, '');
      const pathPart = s.startsWith('/') ? s : `/${s}`;
      try {
        return new URL(pathPart, `${origin}/`).href;
      } catch {
        throw new Error(`Invalid source URL: ${s.slice(0, 200)}`);
      }
    }
  }

  private resolveRedirectUrl(location: string, currentUrl: string): string {
    const loc = (location ?? '').trim();
    try {
      return new URL(loc).href;
    } catch {
      return new URL(loc, currentUrl).href;
    }
  }

  private downloadFile(url: string, destPath: string): Promise<void> {
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
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          reject(err);
        });
    });
  }

  private runFfmpegHls(inputPath: string, outputDir: string): Promise<void> {
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

      const ffmpegPath = this.configService.get<string>('FFMPEG_PATH') || 'ffmpeg';
      const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stderr = '';
      proc.stderr?.on('data', (chunk) => {
        stderr += chunk.toString();
      });
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
      });
      proc.on('error', (err) => reject(err));
    });
  }

  /**
   * Get processing status and master playlist URL when completed.
   */
  async getStatus(videoProcessingId: string) {
    if (!videoProcessingId || !Types.ObjectId.isValid(videoProcessingId)) {
      throw new BadRequestException('Invalid videoProcessingId');
    }
    const record = await this.videoProcessingRepo.findById(videoProcessingId);
    if (!record) {
      throw new NotFoundException('Video processing not found');
    }
    const doc = record as typeof record & { createdAt?: Date; updatedAt?: Date };
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
}
