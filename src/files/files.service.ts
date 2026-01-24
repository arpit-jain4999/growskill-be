import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { FileRepository } from './repositories/file.repository';
import { LoggerService } from '../common/services/logger.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FilesService {
  private readonly baseUrl: string;
  private readonly bucketName: string;
  private uploadSessions: Map<string, { fileKey: string; mimeType: string; callbackUrl?: string }> = new Map();

  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService,
    private logger: LoggerService,
    private httpService: HttpService,
  ) {
    this.logger.setContext('FilesService');
    this.baseUrl = this.configService.get<string>('FILE_BASE_URL') || 'https://storage.example.com';
    this.bucketName = this.configService.get<string>('FILE_BUCKET_NAME') || 'skillgroww-files';
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

    // Store upload session with callback URL if provided
    this.uploadSessions.set(uploadId, {
      fileKey,
      mimeType: dto.mimeType,
      callbackUrl: dto.callbackUrl,
    });

    return {
      uploadId,
      fileKey,
      signedUrl,
      expiresIn: 3600, // 1 hour
    };
  }

  /**
   * Generate signed URL for file upload
   * In production, this would use AWS S3 presigned URL or similar
   */
  private async generateSignedUrl(fileKey: string, mimeType: string): Promise<string> {
    // TODO: Integrate with actual file storage service (AWS S3, Google Cloud Storage, etc.)
    // Example for AWS S3:
    // const s3 = new AWS.S3();
    // return s3.getSignedUrlPromise('putObject', {
    //   Bucket: this.bucketName,
    //   Key: fileKey,
    //   ContentType: mimeType,
    //   Expires: 3600,
    // });

    // Placeholder implementation
    const baseUrl = this.baseUrl;
    return `${baseUrl}/upload?key=${fileKey}&mimeType=${mimeType}`;
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

    // In production, verify the upload was successful with the storage service
    // For now, we'll create the file record

    const fileName = dto.fileKey.split('/').pop() || 'file';
    const fileInfo = await this.fileRepository.create({
      name: fileName,
      key: dto.fileKey,
      baseUrl: this.baseUrl,
      imgUrl: `${this.baseUrl}/${dto.fileKey}`,
      mimeType: uploadSession.mimeType,
      size: dto.fileSize ? parseInt(dto.fileSize, 10) : undefined,
    });

    // Trigger callback if provided
    if (uploadSession.callbackUrl) {
      await this.triggerCallback(uploadSession.callbackUrl, fileInfo);
    }

    // Clean up upload session
    this.uploadSessions.delete(dto.uploadId);

    return {
      fileId: fileInfo._id.toString(),
      file: fileInfo,
    };
  }

  /**
   * Trigger callback URL after upload completion
   */
  private async triggerCallback(callbackUrl: string, fileInfo: any) {
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

