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

  @ApiPropertyOptional({ example: 'Module text or HTML content', description: 'Rich-text / HTML content for the module' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/modules/videos/intro.mp4', description: 'URL of the video associated with this module' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 600, description: 'Video duration in seconds' })
  @IsNumber()
  @IsOptional()
  duration?: number;
}
