export declare class ChapterResponseDto {
    _id: string;
    organizationId: string;
    moduleId: string;
    title: string;
    description?: string;
    order: number;
    isActive: boolean;
    content?: string;
    videoUrl?: string;
    pdfUrl?: string;
    thumbnail?: string;
    duration: number;
    contentType: string;
    createdAt: string;
    updatedAt: string;
}
export declare class ChapterApiResponseDto {
    success: boolean;
    data: ChapterResponseDto;
}
export declare class ChapterListApiResponseDto {
    success: boolean;
    data: ChapterResponseDto[];
}
