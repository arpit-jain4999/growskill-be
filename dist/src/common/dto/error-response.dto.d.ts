export declare class ErrorResponseDto {
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
}
export declare class StandardErrorResponseDto {
    success: boolean;
    error: ErrorResponseDto;
}
