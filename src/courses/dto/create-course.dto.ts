import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class FeeDto {
  @ApiProperty({ example: 5000, description: 'Course amount (in smallest currency unit)' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 500, description: 'Discount amount' })
  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Node.js Masterclass', description: 'Course title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Learn Node.js from scratch', description: 'Course description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Fee breakdown' })
  @ValidateNested()
  @Type(() => FeeDto)
  @IsOptional()
  fee?: FeeDto;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011', description: 'Cohort ID' })
  @IsString()
  @IsOptional()
  cohortId?: string;

  @ApiPropertyOptional({ example: true, description: 'Published state' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg', description: 'Thumbnail URL' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'Development', description: 'Course category' })
  @IsString()
  @IsOptional()
  category?: string;
}
