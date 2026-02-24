export declare class FeeDto {
    amount: number;
    discount: number;
    total: number;
}
export declare class CourseResponseDto {
    _id: string;
    title: string;
    description?: string;
    instructorId: string;
    fee: FeeDto;
    cohortId?: string;
    isPublished: boolean;
    enrollmentCount: number;
    thumbnail?: string;
    category?: string;
    rating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}
export declare class CourseApiResponseDto {
    success: boolean;
    data: CourseResponseDto;
}
export declare class CourseListApiResponseDto {
    success: boolean;
    data: CourseResponseDto[];
}
