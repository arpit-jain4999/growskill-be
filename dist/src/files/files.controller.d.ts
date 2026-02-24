import { FilesService } from './files.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    initiateUpload(dto: InitiateUploadDto): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        fileKey: string;
        signedUrl: string;
        expiresIn: number;
    }>;
    completeUpload(dto: CompleteUploadDto): Promise<{
        fileId: string;
        file: import("../common/schemas/file.schema").FileInfoDocument;
    }>;
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
    getFile(id: string): Promise<import("../common/schemas/file.schema").FileInfoDocument>;
}
