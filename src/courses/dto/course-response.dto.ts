import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Fee object: amount, discount, and computed total (amount - discount).
 */
export class FeeDto {
  @ApiProperty({
    example: 999,
    description: 'Fee amount in smallest currency unit',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    example: 100,
    description: 'Discount in smallest currency unit',
    type: Number,
  })
  discount: number;

  @ApiProperty({
    example: 899,
    description: 'Total payable (amount - discount)',
    type: Number,
  })
  total: number;
}

/**
 * Course entity as returned by the API (single course).
 * Keys with sample data and types for Swagger documentation.
 */
export class CourseResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Course ID',
    type: String,
  })
  _id: string;

  @ApiProperty({
    example: 'Introduction to Node.js',
    description: 'Course title',
    type: String,
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Learn Node.js from scratch with hands-on projects',
    description: 'Course description',
    type: String,
  })
  description?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'Instructor user ID',
    type: String,
  })
  instructorId: string;

  @ApiProperty({
    description: 'Course fee: amount, discount, and total (amount - discount)',
    type: () => FeeDto,
  })
  fee: FeeDto;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439013',
    description: 'Cohort ID when course belongs to a cohort',
    type: String,
  })
  cohortId?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the course is published and visible',
    type: Boolean,
  })
  isPublished: boolean;

  @ApiProperty({
    example: 42,
    description: 'Number of enrolled students',
    type: Number,
  })
  enrollmentCount: number;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/courses/node-thumb.png',
    description: 'Course thumbnail URL',
    type: String,
  })
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'Backend Development',
    description: 'Course category',
    type: String,
  })
  category?: string;

  @ApiProperty({
    example: 4.5,
    description: 'Average rating (0–5)',
    type: Number,
  })
  rating: number;

  @ApiProperty({
    example: 128,
    description: 'Total number of ratings',
    type: Number,
  })
  totalRatings: number;

  @ApiProperty({
    example: '2024-01-15T10:00:00.000Z',
    description: 'Creation timestamp',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-20T14:30:00.000Z',
    description: 'Last update timestamp',
    type: String,
  })
  updatedAt: string;
}

/**
 * Standard API response envelope for a single course.
 * All successful course endpoints return { success, data }.
 */
export class CourseApiResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates the request succeeded',
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'The course object',
    type: CourseResponseDto,
  })
  data: CourseResponseDto;
}

/**
 * Standard API response envelope for a list of courses.
 * Use type callback so Swagger resolves the array item schema correctly.
 */
export class CourseListApiResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates the request succeeded',
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'List of published courses. Each item has _id, title, fee, cohortId, etc.',
    type: () => CourseResponseDto,
    isArray: true,
  })
  data: CourseResponseDto[];
}
