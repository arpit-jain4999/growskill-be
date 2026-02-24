import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GrantPermissionsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: ['course:create', 'course:update', 'module:read'],
    description: 'Permission keys to grant (added to existing permissions)',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions: string[];
}

export class RevokePermissionsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: ['course:create'],
    description: 'Permission keys to revoke (removed from existing permissions)',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions: string[];
}

export class SetPermissionsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Target user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: ['course:read', 'module:read', 'chapter:read'],
    description: 'Complete set of permission keys — replaces all existing permissions',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
