import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the user is new' })
  isNewUser: boolean;
}

export class TokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ example: '2024-01-31T12:00:00.000Z', description: 'Token expiration timestamp' })
  expiresAt: string;
}

export class UserDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  id: string;

  @ApiProperty({ example: '+91', description: 'Country code' })
  countryCode: string;

  @ApiProperty({ example: '9876543210', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'User name', required: false })
  name?: string;

  @ApiProperty({ example: true, description: 'Is user verified' })
  isVerified: boolean;
}

export class VerifyOtpResponseDto {
  @ApiProperty({ type: TokenDto })
  token: TokenDto;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class ProfileResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class ResendOtpResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the user is new' })
  isNewUser: boolean;

  @ApiProperty({ example: 'OTP sent successfully', description: 'Success message' })
  message: string;
}

