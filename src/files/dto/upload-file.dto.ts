import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiateUploadDto {
  @ApiProperty({ example: 'cohort-icon.png', description: 'File name' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/png', description: 'File MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiPropertyOptional({ example: 'cohorts/icons/mobile', description: 'Optional folder path for file organization' })
  @IsString()
  @IsOptional()
  folder?: string; // Optional folder path (e.g., 'cohorts/icons/mobile')

  @ApiPropertyOptional({ example: 'https://api.example.com/webhooks/file-uploaded', description: 'Optional callback URL to notify when upload is complete' })
  @IsUrl()
  @IsOptional()
  callbackUrl?: string; // Optional callback URL to notify when upload is complete
}

export class CompleteUploadDto {
  @ApiProperty({ example: 'uuid-1234-5678', description: 'Upload ID from initiate upload' })
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'File key from initiate upload' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiPropertyOptional({ example: '12345', description: 'File size in bytes' })
  @IsString()
  @IsOptional()
  fileSize?: string; // File size in bytes
}

export class TestUploadDto {
  @ApiProperty({ example: 'test-file.png', description: 'File name for testing' })
  @IsString()
  @IsNotEmpty()
  fileName: string;
  
  @ApiProperty({ example: 'image/png', description: 'File MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiPropertyOptional({ example: 'test', description: 'Optional folder path for testing' })
  @IsString()
  @IsOptional()
  folder?: string;
}

