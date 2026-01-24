import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileInfo } from '../../common/schemas/file.schema';

export class CreateCohortDto {
  @ApiProperty({ example: 'Web Development Cohort', description: 'Cohort name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Cohort icons for mobile and web',
    example: {
      mobile: { name: 'icon.png', key: 'cohorts/icons/mobile/icon.png', baseUrl: 'https://cdn.example.com', imgUrl: 'https://cdn.example.com/cohorts/icons/mobile/icon.png' },
      web: { name: 'icon.png', key: 'cohorts/icons/web/icon.png', baseUrl: 'https://cdn.example.com', imgUrl: 'https://cdn.example.com/cohorts/icons/web/icon.png' }
    }
  })
  @IsOptional()
  icon?: {
    mobile?: FileInfo;
    web?: FileInfo;
  };

  @ApiPropertyOptional({ example: 1, description: 'Display order' })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: 'IN', description: 'Country code' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ example: true, description: 'Visible on home page' })
  @IsBoolean()
  @IsOptional()
  isVisibleOnHomePage?: boolean;

  @ApiPropertyOptional({ example: 'Learn web development from scratch', description: 'Cohort description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z', description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-12-31T00:00:00Z', description: 'End date' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}

