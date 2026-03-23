import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { FileRepository } from './repositories/file.repository';
import { S3StorageService } from './s3-storage.service';
import { LoggerService } from '../common/services/logger.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
import { VideoProcessingService } from '../video-processing/video-processing.service';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { resolvePublicFileStorageBaseUrl } from '../common/utils/storage-public-base-url';
import { resolveLocalUploadsRoot } from '../common/utils/local-media-paths';

@Injectable()
export class FilesService {
  private uploadSessions: Map<
    string,
    { fileKey: string; mimeType: string; callbackUrl?: string; chapterId?: string; moduleId?: string }
  > = new Map();

  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService,
    private logger: LoggerService,
    private httpService: HttpService,
    private s3: S3StorageService,
    @Inject(forwardRef(() => VideoProcessingService))
    private videoProcessingService: VideoProcessingService,
  ) {
    this.logger.setContext('FilesService');
  }

  /**
   * Public base URL for stored objects (used in imgUrl). Empty/placeholder FILE_BASE_URL → local /uploads.
   */
  resolvePublicFileBaseUrl(): string {
    return resolvePublicFileStorageBaseUrl(
      (k) => this.configService.get(k),
      this.s3.isEnabled(),
      this.s3.getBucket(),
    );
  }

  /**
   * Generate a unique file key
   */
  private generateFileKey(fileName: string, folder?: string): string {
    const timestamp = Date.now();
    const uuid = randomUUID().split('-')[0];
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const basePath = folder || 'uploads';
    return `${basePath}/${timestamp}_${uuid}_${sanitizedFileName}`;
  }

  /**
   * Initiate multipart upload and generate signed URL
   */
  async initiateUpload(dto: InitiateUploadDto) {
    this.logger.log(`Initiating upload for file: ${dto.fileName}`);

    const fileKey = this.generateFileKey(dto.fileName, dto.folder);
    const uploadId = randomUUID();

    // Generate signed URL for multipart upload
    const signedUrl = await this.generateSignedUrl(fileKey, dto.mimeType);
    const expiresIn =
      parseInt(this.configService.get<string>('S3_PRESIGNED_EXPIRES_SEC') || '3600', 10) || 3600;

    // Store upload session: optional chapterId and/or moduleId tie HLS output to content after transcode
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
      expiresIn,
    };
  }

  /**
   * Generate signed URL for file upload
   * In production, this would use AWS S3 presigned URL or similar
   */
  private async generateSignedUrl(fileKey: string, mimeType: string): Promise<string> {
    if (this.s3.isEnabled()) {
      const expires = parseInt(this.configService.get<string>('S3_PRESIGNED_EXPIRES_SEC') || '3600', 10) || 3600;
      const url = await this.s3.getPresignedPutUrl(fileKey, mimeType, expires);
      this.logger.log(`S3 presigned PUT for key: ${fileKey}`);
      return url;
    }
    const origin = this.resolveAppOrigin();
    return `${origin}/fake-upload?key=${encodeURIComponent(fileKey)}&mimeType=${encodeURIComponent(mimeType)}`;
  }

  /** Origin for synthetic signed URLs (not the same as public file CDN base). */
  private resolveAppOrigin(): string {
    const fb = (this.configService.get<string>('FILE_BASE_URL') ?? '').trim();
    if (fb && !/storage\.example\.com/i.test(fb)) {
      try {
        return new URL(fb).origin;
      } catch {
        /* use localhost */
      }
    }
    const port = this.configService.get<number>('PORT') || 3000;
    return `http://localhost:${port}`;
  }

  /**
   * Complete multipart upload and save file info
   */
  async completeUpload(dto: CompleteUploadDto) {
    this.logger.log(`Completing upload: ${dto.uploadId}, key: ${dto.fileKey}`);

    // Verify upload session exists
    const uploadSession = this.uploadSessions.get(dto.uploadId);
    if (!uploadSession) {
      throw new BadRequestException('Invalid upload session');
    }

    // Verify file key matches
    if (uploadSession.fileKey !== dto.fileKey) {
      throw new BadRequestException('File key mismatch');
    }

    let sizeFromS3: number | undefined;
    if (this.s3.isEnabled()) {
      try {
        const meta = await this.s3.assertObjectExists(dto.fileKey);
        sizeFromS3 = meta.contentLength;
      } catch {
        throw new BadRequestException(
          `No object in S3 at key "${dto.fileKey}". PUT the file to the presigned URL first, then call complete.`,
        );
      }
    }

    const fileName = dto.fileKey.split('/').pop() || 'file';
    const publicBase = this.resolvePublicFileBaseUrl();
    const parsedSize = dto.fileSize ? parseInt(dto.fileSize, 10) : undefined;
    const fileInfo = await this.fileRepository.create({
      name: fileName,
      key: dto.fileKey,
      baseUrl: publicBase,
      imgUrl: `${publicBase}/${dto.fileKey}`,
      mimeType: uploadSession.mimeType,
      size: parsedSize ?? sizeFromS3,
    });

    // All video uploads: enqueue HLS transcoding. Optional chapterId / moduleId receive the master URL when done.
    const isVideo = uploadSession.mimeType.startsWith('video/');
    let videoProcessingId: string | undefined;
    let hlsMasterUrl: string | undefined;
    if (isVideo) {
      try {
        const result = await this.videoProcessingService.startTranscode({
          sourceFileId: fileInfo._id.toString(),
          chapterId: uploadSession.chapterId,
          moduleId: uploadSession.moduleId,
        });
        videoProcessingId = result.videoProcessingId;
        hlsMasterUrl = result.hlsMasterUrl;
      } catch (err: any) {
        this.logger.error(`Failed to enqueue video processing: ${err?.message}`);
      }
    }

    // Trigger callback if provided
    if (uploadSession.callbackUrl) {
      await this.triggerCallback(uploadSession.callbackUrl, fileInfo, {
        ...(videoProcessingId && { videoProcessingId }),
        ...(hlsMasterUrl && { hlsMasterUrl }),
        ...(isVideo && { videoProcessingStatus: videoProcessingId ? 'pending' : 'failed_to_enqueue' }),
      });
    }

    // Clean up upload session
    this.uploadSessions.delete(dto.uploadId);

    return {
      fileId: fileInfo._id.toString(),
      file: fileInfo,
      ...(videoProcessingId && {
        videoProcessingId,
        hlsMasterUrl,
        videoProcessingStatus: 'pending' as const,
      }),
    };
  }

  /**
   * Trigger callback URL after upload completion
   */
  private async triggerCallback(
    callbackUrl: string,
    fileInfo: any,
    videoMeta?: {
      videoProcessingId?: string;
      hlsMasterUrl?: string;
      videoProcessingStatus?: string;
    },
  ) {
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

      await firstValueFrom(
        this.httpService.post(callbackUrl, callbackData, {
          timeout: 5000,
        }),
      );

      this.logger.log(`Callback triggered successfully`);
    } catch (error) {
      this.logger.error(`Failed to trigger callback: ${error.message}`, error.stack);
      // Don't throw error - callback failure shouldn't fail the upload completion
    }
  }

  /**
   * Test file upload from backend
   */
  async testUpload(dto: TestUploadDto) {
    this.logger.log(`Testing file upload for: ${dto.fileName}`);

    // Initiate upload
    const initiateResult = await this.initiateUpload({
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      folder: dto.folder,
    });

    // In a real scenario, you would upload the file here
    // For testing, we'll simulate the upload completion
    this.logger.log(`Test upload initiated. Upload file to: ${initiateResult.signedUrl}`);

    // Return the upload details for manual testing
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

  /**
   * Save multipart upload to disk under LOCAL_UPLOADS_ROOT (default: OS temp, not ./storage) and create FileInfo.
   * Form fields (optional): folder, moduleId, chapterId — send them before the file part for correct folder routing.
   */
  async uploadMultipartDirect(req: FastifyRequest) {
    if (typeof req.isMultipart !== 'function' || !req.isMultipart()) {
      const ct = String(req.headers['content-type'] ?? '');
      const jsonHint = ct.includes('application/json')
        ? ' You sent application/json; this route does not accept JSON. Send multipart/form-data with a real file binary in a part named "file". Example: curl -F "folder=chapters/videos" -F "chapterId=YOUR_ID" -F "file=@/path/to/video.mp4" -H "Authorization: Bearer TOKEN" http://localhost:8080/v1/files/upload/direct'
        : '';
      throw new BadRequestException(
        `Expected multipart/form-data with a part named "file" (binary upload).${jsonHint}`,
      );
    }

    let folder = 'uploads';
    let moduleId: string | undefined;
    let chapterId: string | undefined;
    let wroteFile = false;
    let fileKey = '';
    let originalName = 'upload.bin';
    let mimeType = 'application/octet-stream';
    let size = 0;

    const uploadsRoot = resolveLocalUploadsRoot(this.configService.get<string>('LOCAL_UPLOADS_ROOT'));

    for await (const part of req.parts()) {
      if (part.type === 'field') {
        const v = String(part.value ?? '').trim();
        if (part.fieldname === 'folder' && v) folder = v;
        if (part.fieldname === 'moduleId' && v) moduleId = v;
        if (part.fieldname === 'chapterId' && v) chapterId = v;
      } else if (part.type === 'file') {
        if (wroteFile) {
          part.file.resume();
          continue;
        }
        originalName = part.filename || originalName;
        mimeType = part.mimetype || mimeType;
        fileKey = this.generateFileKey(originalName, folder);
        if (this.s3.isEnabled()) {
          const { size: uploaded } = await this.s3.uploadStream(fileKey, part.file, mimeType);
          size = uploaded ?? 0;
        } else {
          const destPath = path.join(uploadsRoot, fileKey);
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          await pipeline(part.file, fs.createWriteStream(destPath));
          size = fs.statSync(destPath).size;
        }
        wroteFile = true;
      }
    }

    if (!wroteFile || !fileKey) {
      throw new BadRequestException('No file field received (use field name "file" in multipart)');
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
    let videoProcessingId: string | undefined;
    let hlsMasterUrl: string | undefined;
    if (isVideo) {
      try {
        const result = await this.videoProcessingService.startTranscode({
          sourceFileId: fileInfo._id.toString(),
          chapterId,
          moduleId,
        });
        videoProcessingId = result.videoProcessingId;
        hlsMasterUrl = result.hlsMasterUrl;
      } catch (err: any) {
        this.logger.error(`Failed to enqueue video processing: ${err?.message}`);
      }
    }

    return {
      fileId: fileInfo._id.toString(),
      file: fileInfo,
      ...(videoProcessingId && {
        videoProcessingId,
        hlsMasterUrl,
        videoProcessingStatus: 'pending' as const,
      }),
    };
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string) {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return file;
  }
}

