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
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const fs_1 = require("fs");
const promises_1 = require("stream/promises");
let S3StorageService = class S3StorageService {
    constructor(configService) {
        this.configService = configService;
        const useLocal = this.configService.get('STORAGE_USE_LOCAL') === 'true';
        const bucket = (this.configService.get('AWS_S3_BUCKET') ||
            this.configService.get('FILE_BUCKET_NAME') ||
            '').trim();
        if (useLocal || !bucket) {
            this.bucket = '';
            this.client = null;
            return;
        }
        const region = (this.configService.get('AWS_REGION') || 'us-east-1').trim();
        const endpoint = (this.configService.get('AWS_S3_ENDPOINT') || '').trim() || undefined;
        const forcePathStyle = this.configService.get('AWS_S3_FORCE_PATH_STYLE') === 'true';
        this.bucket = bucket;
        this.client = new client_s3_1.S3Client({
            region,
            endpoint,
            forcePathStyle,
        });
    }
    isEnabled() {
        return this.client !== null && this.bucket.length > 0;
    }
    getBucket() {
        return this.bucket;
    }
    async getPresignedPutUrl(key, contentType, expiresInSeconds = 3600) {
        if (!this.client)
            throw new Error('S3 is not configured');
        const cmd = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, cmd, { expiresIn: expiresInSeconds });
    }
    async uploadStream(key, body, contentType) {
        if (!this.client)
            throw new Error('S3 is not configured');
        const upload = new lib_storage_1.Upload({
            client: this.client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            },
        });
        await upload.done();
        const out = await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucket, Key: key }));
        const size = out.ContentLength;
        return { size: typeof size === 'number' ? size : undefined };
    }
    async getObjectToFile(key, destPath) {
        if (!this.client)
            throw new Error('S3 is not configured');
        const out = await this.client.send(new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
        const body = out.Body;
        if (!body) {
            throw new Error(`S3 GetObject returned empty body for key: ${key}`);
        }
        await (0, promises_1.pipeline)(body, (0, fs_1.createWriteStream)(destPath));
    }
    async uploadLocalFile(key, absolutePath, contentType, cacheControl) {
        if (!this.client)
            throw new Error('S3 is not configured');
        const stream = (0, fs_1.createReadStream)(absolutePath);
        const upload = new lib_storage_1.Upload({
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
    async assertObjectExists(key) {
        if (!this.client)
            return {};
        try {
            const out = await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucket, Key: key }));
            return { contentLength: out.ContentLength };
        }
        catch (e) {
            const status = e.$metadata?.httpStatusCode;
            if (e instanceof client_s3_1.NotFound || status === 404) {
                throw new Error(`S3 object not found: ${key}`);
            }
            throw e;
        }
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map