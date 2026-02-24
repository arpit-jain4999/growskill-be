import { ApiProperty } from '@nestjs/swagger';

export class PermissionInfoDto {
  @ApiProperty({ example: 'course:create', description: 'Permission key' })
  key: string;

  @ApiProperty({ example: 'Course', description: 'Resource group the permission belongs to' })
  group: string;

  @ApiProperty({ example: 'Create courses', description: 'Human-readable description' })
  label: string;
}

export class UserPermissionsResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'USER', description: 'User role' })
  role: string;

  @ApiProperty({
    example: ['course:read', 'module:read'],
    description: 'Permissions explicitly assigned to this user',
    type: [String],
  })
  assignedPermissions: string[];

  @ApiProperty({
    example: ['course:read', 'module:read', 'chapter:read', 'cohort:read'],
    description: 'Effective permissions (assigned + role-based auto-grants)',
    type: [String],
  })
  effectivePermissions: string[];
}

export class AvailablePermissionsResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'All grantable permissions grouped by resource', type: () => PermissionInfoDto, isArray: true })
  data: PermissionInfoDto[];
}

export class UserPermissionsApiResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success: boolean;

  @ApiProperty({ type: UserPermissionsResponseDto })
  data: UserPermissionsResponseDto;
}

export class PermissionUpdateResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success: boolean;

  @ApiProperty({ description: 'Updated user permissions', type: UserPermissionsResponseDto })
  data: UserPermissionsResponseDto;
}
