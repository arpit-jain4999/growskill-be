import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'Course ID (MongoDB ObjectId). Omit if order is not for a specific course.',
    example: '507f1f77bcf86cd799439012',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Cohort ID (MongoDB ObjectId). Omit if order is not for a specific cohort.',
    example: '507f1f77bcf86cd799439013',
  })
  @IsOptional()
  @IsString()
  cohortId?: string;

  @ApiProperty({
    description: 'Order amount in smallest currency unit (e.g. paise for INR, cents for USD). Must be >= 0.',
    minimum: 0,
    example: 99900,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
