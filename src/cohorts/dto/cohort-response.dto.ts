import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class FileInfoDto {
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
}

export class CohortIconDto {
  @ApiPropertyOptional({ type: FileInfoDto })
  mobile?: FileInfoDto;

  @ApiPropertyOptional({ type: FileInfoDto })
  web?: FileInfoDto;
}

export class CohortResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Cohort ID' })
  _id: string;

  @ApiProperty({ example: 'Web Development Cohort', description: 'Cohort name' })
  name: string;

  @ApiPropertyOptional({ type: CohortIconDto })
  icon?: CohortIconDto;

  @ApiProperty({ example: 1, description: 'Display order' })
  displayOrder: number;

  @ApiProperty({ example: 'IN', description: 'Country code' })
  countryCode: string;

  @ApiProperty({ example: true, description: 'Visible on home page' })
  isVisibleOnHomePage: boolean;

  @ApiPropertyOptional({ example: 'Learn web development from scratch', description: 'Cohort description' })
  description?: string;
}

export class CohortListResponseDto {
  @ApiProperty({ type: [CohortResponseDto] })
  cohorts: CohortResponseDto[];
}

