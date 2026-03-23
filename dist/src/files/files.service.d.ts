import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import type { FastifyRequest } from 'fastify';
import { FileRepository } from './repositories/file.repository';
import { LoggerService } from '../common/services/logger.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
import { VideoProcessingService } from '../video-processing/video-processing.service';
export declare class FilesService {
    private fileRepository;
    private configService;
    private logger;
    private httpService;
    private videoProcessingService;
    private readonly bucketName;
    private uploadSessions;
    constructor(fileRepository: FileRepository, configService: ConfigService, logger: LoggerService, httpService: HttpService, videoProcessingService: VideoProcessingService);
    resolvePublicFileBaseUrl(): string;
    private generateFileKey;
    initiateUpload(dto: InitiateUploadDto): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        fileKey: string;
        signedUrl: string;
        expiresIn: number;
    }>;
    private generateSignedUrl;
    private resolveAppOrigin;
    completeUpload(dto: CompleteUploadDto): Promise<{
        videoProcessingId: string;
        hlsMasterUrl: string;
        videoProcessingStatus: "pending";
        fileId: string;
        file: import("../common/schemas/file.schema").FileInfoDocument;
    }>;
    private triggerCallback;
    testUpload(dto: TestUploadDto): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        fileKey: string;
        signedUrl: string;
        message: string;
        completeEndpoint: string;
        completePayload: {
            uploadId: `${string}-${string}-${string}-${string}-${string}`;
            fileKey: string;
        };
    }>;
    uploadMultipartDirect(req: FastifyRequest): Promise<{
        videoProcessingId: string;
        hlsMasterUrl: string;
        videoProcessingStatus: "pending";
        fileId: string;
        file: import("../common/schemas/file.schema").FileInfoDocument;
    }>;
    getFileById(fileId: string): Promise<import("../common/schemas/file.schema").FileInfoDocument>;
}
