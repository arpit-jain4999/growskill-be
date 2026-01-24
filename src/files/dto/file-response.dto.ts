import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileInfoResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'File ID' })
  _id: string;

  @ApiProperty({ example: 'cohort-icon.png', description: 'File name' })
  name: string;

  @ApiProperty({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'File key/path' })
  key: string;

  @ApiProperty({ example: 'https://cdn.example.com', description: 'Base URL' })
  baseUrl: string;

  @ApiProperty({ example: 'https://cdn.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'Complete image URL' })
  imgUrl: string;

  @ApiPropertyOptional({ example: 'image/png', description: 'MIME type' })
  mimeType?: string;

  @ApiPropertyOptional({ example: 12345, description: 'File size in bytes' })
  size?: number;

  @ApiProperty({ example: '2024-01-23T12:00:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-23T12:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: string;
}

export class InitiateUploadResponseDto {
  @ApiProperty({ example: 'uuid-1234-5678', description: 'Upload ID for tracking' })
  uploadId: string;

  @ApiProperty({ example: 'cohorts/icons/mobile/1234567890_abc123_cohort-icon.png', description: 'Generated file key' })
  fileKey: string;

  @ApiProperty({ example: 'https://storage.example.com/upload?key=...', description: 'Signed URL for upload' })
  signedUrl: string;

  @ApiProperty({ example: 3600, description: 'URL expiration time in seconds' })
  expiresIn: number;
}

export class CompleteUploadResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'File ID' })
  fileId: string;

  @ApiProperty({ type: FileInfoResponseDto })
  file: FileInfoResponseDto;
}

export class TestUploadResponseDto {
  @ApiProperty({ example: 'uuid-1234-5678', description: 'Upload ID' })
  uploadId: string;

  @ApiProperty({ example: 'test/1234567890_abc123_test-file.png', description: 'File key' })
  fileKey: string;

  @ApiProperty({ example: 'https://storage.example.com/upload?key=...', description: 'Signed URL' })
  signedUrl: string;

  @ApiProperty({ example: 'Upload initiated. Use the complete endpoint to finish the upload.', description: 'Instructions' })
  message: string;

  @ApiProperty({ example: '/files/upload/complete', description: 'Complete upload endpoint' })
  completeEndpoint: string;

  @ApiProperty({ 
    example: { uploadId: 'uuid-1234-5678', fileKey: 'test/1234567890_abc123_test-file.png' },
    description: 'Payload for complete endpoint' 
  })
  completePayload: {
    uploadId: string;
    fileKey: string;
  };
}

