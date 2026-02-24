import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Learning' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '29AABCT1234A1Z5' })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  contactPersonName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  contactPersonNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  billingDetails?: {
    companyName?: string;
    billingEmail?: string;
    billingAddress?: Record<string, unknown>;
    notes?: string;
  };
}

export class AssignSuperAdminDto {
  @ApiProperty({ example: 'admin@acme.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Admin User' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+91' })
  @IsString()
  countryCode: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  phoneNumber: string;
}
