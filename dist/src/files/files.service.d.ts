import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { FileRepository } from './repositories/file.repository';
import { LoggerService } from '../common/services/logger.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
export declare class FilesService {
    private fileRepository;
    private configService;
    private logger;
    private httpService;
    private readonly baseUrl;
    private readonly bucketName;
    private uploadSessions;
    constructor(fileRepository: FileRepository, configService: ConfigService, logger: LoggerService, httpService: HttpService);
    private generateFileKey;
    initiateUpload(dto: InitiateUploadDto): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        fileKey: string;
        signedUrl: string;
        expiresIn: number;
    }>;
    private generateSignedUrl;
    completeUpload(dto: CompleteUploadDto): Promise<{
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
    getFileById(fileId: string): Promise<import("../common/schemas/file.schema").FileInfoDocument>;
}
