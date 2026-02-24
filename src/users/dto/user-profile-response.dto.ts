import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * User profile as returned by GET /users/profile and PUT /users/profile.
 * Response body is wrapped as { success: true, data: UserProfileResponseDto }.
 */
export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Country code (e.g. 91 for India)',
    example: '91',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Phone number',
    example: '9876543210',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Display name (may be first + last or custom)',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'Whether the user has verified their phone',
    example: true,
  })
  isVerified: boolean;

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/avatars/john.jpg',
  })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Software developer',
  })
  bio?: string;
}
