import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllCoursesQueryDto {
  @ApiPropertyOptional({
    example: 'Node.js',
    description: 'Search courses by name (title). Case-insensitive partial match.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'Filter courses by cohort ID (MongoDB ObjectId).',
  })
  @IsOptional()
  @IsMongoId()
  cohortId?: string;
}
