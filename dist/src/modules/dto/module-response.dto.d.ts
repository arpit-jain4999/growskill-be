export declare class ModuleResponseDto {
    _id: string;
    organizationId: string;
    title: string;
    description?: string;
    courseId?: string;
    order: number;
    isActive: boolean;
    content?: string;
    videoUrl?: string;
    duration?: number;
    createdAt: string;
    updatedAt: string;
}
export declare class ModuleApiResponseDto {
    success: boolean;
    data: ModuleResponseDto;
}
export declare class ModuleListApiResponseDto {
    success: boolean;
    data: ModuleResponseDto[];
}
