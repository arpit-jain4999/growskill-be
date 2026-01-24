import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'Invalid or expired OTP', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: '2024-01-23T12:00:00.000Z', description: 'Error timestamp' })
  timestamp: string;

  @ApiProperty({ example: '/auth/verify-otp', description: 'Request path' })
  path: string;
}

export class StandardErrorResponseDto {
  @ApiProperty({ example: false, description: 'Success indicator' })
  success: boolean;

  @ApiProperty({ type: ErrorResponseDto })
  error: ErrorResponseDto;
}

