import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'Introduction to JavaScript', description: 'Module title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Covers JS basics', description: 'Module description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011', description: 'Course ID this module belongs to' })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional({ example: 1, description: 'Display order within the course' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether the module is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
