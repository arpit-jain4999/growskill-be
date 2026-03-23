import { ConfigService } from '@nestjs/config';
import type { Readable } from 'stream';
export declare class S3StorageService {
    private readonly configService;
    private readonly client;
    private readonly bucket;
    constructor(configService: ConfigService);
    isEnabled(): boolean;
    getBucket(): string;
    getPresignedPutUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<string>;
    uploadStream(key: string, body: Readable, contentType: string): Promise<{
        size?: number;
    }>;
    getObjectToFile(key: string, destPath: string): Promise<void>;
    uploadLocalFile(key: string, absolutePath: string, contentType: string, cacheControl?: string): Promise<void>;
    assertObjectExists(key: string): Promise<{
        contentLength?: number;
    }>;
}
