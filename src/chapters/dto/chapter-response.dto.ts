import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChapterResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Chapter ID', type: String })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439020', description: 'Organization ID', type: String })
  organizationId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439015', description: 'Module ID this chapter belongs to', type: String })
  moduleId: string;

  @ApiProperty({ example: 'Variables and Data Types', description: 'Chapter title', type: String })
  title: string;

  @ApiPropertyOptional({ example: 'Learn about JS variables', description: 'Chapter description', type: String })
  description?: string;

  @ApiProperty({ example: 1, description: 'Display order within the module (0-based)', type: Number })
  order: number;

  @ApiProperty({ example: true, description: 'Whether the chapter is active / visible', type: Boolean })
  isActive: boolean;

  @ApiPropertyOptional({ example: '# Variables\n\nJavaScript has three ways…', description: 'Rich-text / markdown content', type: String })
  content?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/variables.mp4', description: 'Video URL', type: String })
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/variables.pdf', description: 'PDF URL', type: String })
  pdfUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/chapters/thumb.png', description: 'Thumbnail URL', type: String })
  thumbnail?: string;

  @ApiProperty({ example: 15, description: 'Duration in minutes', type: Number })
  duration: number;

  @ApiProperty({ example: 'video', description: 'Content type (video | pdf | text | mixed)', type: String })
  contentType: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z', description: 'Creation timestamp', type: String })
  createdAt: string;

  @ApiProperty({ example: '2024-01-20T14:30:00.000Z', description: 'Last update timestamp', type: String })
  updatedAt: string;
}

export class ChapterApiResponseDto {
  @ApiProperty({ example: true, description: 'Indicates the request succeeded', type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'The chapter object', type: ChapterResponseDto })
  data: ChapterResponseDto;
}

export class ChapterListApiResponseDto {
  @ApiProperty({ example: true, description: 'Indicates the request succeeded', type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'List of chapters', type: () => ChapterResponseDto, isArray: true })
  data: ChapterResponseDto[];
}
