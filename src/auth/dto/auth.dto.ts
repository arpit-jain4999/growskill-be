import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ example: '+91', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '9876543210', description: 'Phone number (10 digits)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+91', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '9876543210', description: 'Phone number (10 digits)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: 'OTP (6 digits)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Name for new users only; omit for existing users' })
  @IsOptional()
  @IsString()
  name?: string;
}

