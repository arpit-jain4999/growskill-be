import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  NotFound,
} from '@aws-sdk/client-s3';
import type { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

/**
 * AWS S3 integration. Enabled when AWS_S3_BUCKET (or FILE_BUCKET_NAME) is set and STORAGE_USE_LOCAL is not "true".
 * Credentials: default AWS SDK chain (env keys, ~/.aws/credentials, IAM role on EC2/ECS/Lambda).
 */
@Injectable()
export class S3StorageService {
  private readonly client: S3Client | null;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const useLocal = this.configService.get<string>('STORAGE_USE_LOCAL') === 'true';
    const bucket = (
      this.configService.get<string>('AWS_S3_BUCKET') ||
      this.configService.get<string>('FILE_BUCKET_NAME') ||
      ''
    ).trim();

    if (useLocal || !bucket) {
      this.bucket = '';
      this.client = null;
      return;
    }

    const region = (this.configService.get<string>('AWS_REGION') || 'us-east-1').trim();
    const endpoint = (this.configService.get<string>('AWS_S3_ENDPOINT') || '').trim() || undefined;
    const forcePathStyle = this.configService.get<string>('AWS_S3_FORCE_PATH_STYLE') === 'true';

    this.bucket = bucket;
    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle,
    });
  }

  isEnabled(): boolean {
    return this.client !== null && this.bucket.length > 0;
  }

  getBucket(): string {
    return this.bucket;
  }

  async getPresignedPutUrl(key: string, contentType: string, expiresInSeconds = 3600): Promise<string> {
    if (!this.client) throw new Error('S3 is not configured');
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.client, cmd, { expiresIn: expiresInSeconds });
  }

  /**
   * Upload a readable stream (e.g. multipart file part) to S3.
   */
  async uploadStream(key: string, body: Readable, contentType: string): Promise<{ size?: number }> {
    if (!this.client) throw new Error('S3 is not configured');
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });
    await upload.done();
    const out = await this.client.send(
      new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    const size = out.ContentLength;
    return { size: typeof size === 'number' ? size : undefined };
  }

  /**
   * Download object to a local path (for ffmpeg when the bucket is private / CloudFront returns 403 to anonymous GET).
   */
  async getObjectToFile(key: string, destPath: string): Promise<void> {
    if (!this.client) throw new Error('S3 is not configured');
    const out = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    const body = out.Body;
    if (!body) {
      throw new Error(`S3 GetObject returned empty body for key: ${key}`);
    }
    // Node.js: Body is a stream
    await pipeline(body as Readable, createWriteStream(destPath));
  }

  /** Throws if object is missing (used after client-side PUT to S3). */
  /**
   * Upload a local file to S3 (multipart-capable). Used for HLS playlists and segments after transcoding.
   */
  async uploadLocalFile(
    key: string,
    absolutePath: string,
    contentType: string,
    cacheControl?: string,
  ): Promise<void> {
    if (!this.client) throw new Error('S3 is not configured');
    const stream = createReadStream(absolutePath);
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
        ...(cacheControl ? { CacheControl: cacheControl } : {}),
      },
    });
    await upload.done();
  }

  async assertObjectExists(key: string): Promise<{ contentLength?: number }> {
    if (!this.client) return {};
    try {
      const out = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return { contentLength: out.ContentLength };
    } catch (e: unknown) {
      const status = (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      if (e instanceof NotFound || status === 404) {
        throw new Error(`S3 object not found: ${key}`);
      }
      throw e;
    }
  }
}
