declare class FeeDto {
    amount: number;
    discount?: number;
}
export declare class CreateCourseDto {
    title: string;
    description?: string;
    fee?: FeeDto;
    cohortId?: string;
    isPublished?: boolean;
    thumbnail?: string;
    category?: string;
}
export {};
