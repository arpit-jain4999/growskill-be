import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModuleResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Module ID', type: String })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439020', description: 'Organization ID the module belongs to', type: String })
  organizationId: string;

  @ApiProperty({ example: 'Introduction to JavaScript', description: 'Module title', type: String })
  title: string;

  @ApiPropertyOptional({ example: 'Covers JS basics: variables, functions, and control flow', description: 'Module description', type: String })
  description?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439015', description: 'Course ID this module belongs to (null if standalone)', type: String })
  courseId?: string;

  @ApiProperty({ example: 1, description: 'Display order within the course (0-based)', type: Number })
  order: number;

  @ApiProperty({ example: true, description: 'Whether the module is active / visible', type: Boolean })
  isActive: boolean;

  @ApiPropertyOptional({ example: 'Module text or HTML content', description: 'Rich-text / HTML content for the module', type: String })
  content?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/modules/videos/intro.mp4', description: 'URL of the video associated with this module', type: String })
  videoUrl?: string;

  @ApiPropertyOptional({ example: 600, description: 'Video duration in seconds', type: Number })
  duration?: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z', description: 'Creation timestamp', type: String })
  createdAt: string;

  @ApiProperty({ example: '2024-01-20T14:30:00.000Z', description: 'Last update timestamp', type: String })
  updatedAt: string;
}

export class ModuleApiResponseDto {
  @ApiProperty({ example: true, description: 'Indicates the request succeeded', type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'The module object', type: ModuleResponseDto })
  data: ModuleResponseDto;
}

export class ModuleListApiResponseDto {
  @ApiProperty({ example: true, description: 'Indicates the request succeeded', type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'List of modules', type: () => ModuleResponseDto, isArray: true })
  data: ModuleResponseDto[];
}
