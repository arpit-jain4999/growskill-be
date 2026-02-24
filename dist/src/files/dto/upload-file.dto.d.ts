export declare class InitiateUploadDto {
    fileName: string;
    mimeType: string;
    folder?: string;
    callbackUrl?: string;
}
export declare class CompleteUploadDto {
    uploadId: string;
    fileKey: string;
    fileSize?: string;
}
export declare class TestUploadDto {
    fileName: string;
    mimeType: string;
    folder?: string;
}
