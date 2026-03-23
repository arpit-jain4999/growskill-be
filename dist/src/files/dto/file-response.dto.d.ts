export declare class FileInfoResponseDto {
    _id: string;
    name: string;
    key: string;
    baseUrl: string;
    imgUrl: string;
    mimeType?: string;
    size?: number;
    createdAt: string;
    updatedAt: string;
}
export declare class InitiateUploadResponseDto {
    uploadId: string;
    fileKey: string;
    signedUrl: string;
    expiresIn: number;
}
export declare class CompleteUploadResponseDto {
    fileId: string;
    file: FileInfoResponseDto;
    videoProcessingId?: string;
    hlsMasterUrl?: string;
    videoProcessingStatus?: 'pending' | 'failed_to_enqueue';
}
export declare class TestUploadResponseDto {
    uploadId: string;
    fileKey: string;
    signedUrl: string;
    message: string;
    completeEndpoint: string;
    completePayload: {
        uploadId: string;
        fileKey: string;
    };
}
