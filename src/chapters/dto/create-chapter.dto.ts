import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Module ID this chapter belongs to' })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({ example: 'Variables and Data Types', description: 'Chapter title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Learn about JS variables, let, const, and var', description: 'Chapter description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Display order within the module (0-based)' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether the chapter is active / visible' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '# Variables\n\nJavaScript has three ways to declare variables…', description: 'Rich-text / markdown content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/variables.mp4', description: 'Video URL' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/variables.pdf', description: 'PDF URL' })
  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/thumb.png', description: 'Thumbnail URL' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 15, description: 'Duration in minutes' })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ example: 'video', description: 'Content type', enum: ['video', 'pdf', 'text', 'mixed'] })
  @IsString()
  @IsOptional()
  @IsIn(['video', 'pdf', 'text', 'mixed'])
  contentType?: string;
}
