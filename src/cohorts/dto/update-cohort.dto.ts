import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FileInfo } from '../../common/schemas/file.schema';

export class UpdateCohortDto {
  @ApiPropertyOptional({ example: 'Updated Cohort Name', description: 'Cohort name' })
  @IsString()
  @IsOptional()
  name?: string;

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

  @ApiPropertyOptional({ example: 2, description: 'Display order' })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: 'US', description: 'Country code' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ example: false, description: 'Visible on home page' })
  @IsBoolean()
  @IsOptional()
  isVisibleOnHomePage?: boolean;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Cohort description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2024-02-01T00:00:00Z', description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-11-30T00:00:00Z', description: 'End date' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ example: false, description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 150, description: 'Maximum participants' })
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @ApiPropertyOptional({ example: 50, description: 'Current participants' })
  @IsNumber()
  @IsOptional()
  currentParticipants?: number;
}

