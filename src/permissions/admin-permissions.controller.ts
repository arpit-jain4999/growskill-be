import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse,
  ApiUnauthorizedResponse, ApiParam, ApiBearerAuth, ApiExtraModels,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import {
  GrantPermissionsDto,
  RevokePermissionsDto,
  SetPermissionsDto,
} from './dto/permission-management.dto';
import {
  PermissionInfoDto,
  AvailablePermissionsResponseDto,
  UserPermissionsApiResponseDto,
  PermissionUpdateResponseDto,
} from './dto/permission-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { PERMISSIONS } from '../common/constants/permissions';
import { PERMISSION_META } from '../common/constants/permission-meta';

@ApiTags('Admin – Permissions')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(
  PermissionInfoDto,
  AvailablePermissionsResponseDto,
  UserPermissionsApiResponseDto,
  PermissionUpdateResponseDto,
  GrantPermissionsDto,
  RevokePermissionsDto,
  SetPermissionsDto,
)
@Controller('v1/admin/permissions')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminPermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('available')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'List all grantable permissions',
    description: 'Returns every permission key with its group and human-readable label. Use this to build a permissions picker UI.',
  })
  @ApiOkResponse({ description: 'List of all permissions', type: AvailablePermissionsResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission:grant permission', type: StandardErrorResponseDto })
  async listAvailable() {
    return PERMISSION_META;
  }

  @Get('org')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'List permissions available for this organisation',
    description: 'Returns permission keys that have been enabled for the current org (based on enabled modules).',
  })
  @ApiOkResponse({ description: 'Org-level permission keys' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission', type: StandardErrorResponseDto })
  async listOrgPermissions(@CurrentActor() actor: Actor) {
    const keys = await this.permissionsService.getOrgPermissions(actor.organizationId!);
    return { permissions: keys };
  }

  @Get('user/:userId')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'Get a user\'s permissions',
    description: 'Returns both the explicitly assigned permissions and the effective permissions (which include role-based auto-grants).',
  })
  @ApiParam({ name: 'userId', description: 'Target user ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'User permissions', type: UserPermissionsApiResponseDto })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'User not in your organisation or missing permission', type: StandardErrorResponseDto })
  async getUserPermissions(
    @Param('userId') userId: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.permissionsService.getUserPermissions(userId, actor.organizationId!);
  }

  @Post('grant')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'Grant permissions to a user',
    description: 'Adds the specified permission keys to the user. Only permissions available for this org (enabled modules) can be granted.',
  })
  @ApiCreatedResponse({ description: 'Permissions granted. Returns updated permissions.', type: PermissionUpdateResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID or unknown/unavailable permission keys', type: StandardErrorResponseDto })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'User not in your organisation or missing permission', type: StandardErrorResponseDto })
  async grant(
    @Body() dto: GrantPermissionsDto,
    @CurrentActor() actor: Actor,
  ) {
    return this.permissionsService.grantToUser(
      actor.organizationId!,
      dto.userId,
      dto.permissions,
      actor.userId,
    );
  }

  @Post('revoke')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'Revoke permissions from a user',
    description: 'Removes the specified permission keys from the user. Other permissions are preserved.',
  })
  @ApiCreatedResponse({ description: 'Permissions revoked. Returns updated permissions.', type: PermissionUpdateResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID or unknown permission keys', type: StandardErrorResponseDto })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'User not in your organisation or missing permission', type: StandardErrorResponseDto })
  async revoke(
    @Body() dto: RevokePermissionsDto,
    @CurrentActor() actor: Actor,
  ) {
    return this.permissionsService.revokeFromUser(
      actor.organizationId!,
      dto.userId,
      dto.permissions,
    );
  }

  @Post('set')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({
    summary: 'Set (replace) a user\'s permissions',
    description: 'Replaces the user\'s entire permission set with the provided list. Pass an empty array to clear all. Only org-available permissions can be set.',
  })
  @ApiCreatedResponse({ description: 'Permissions replaced. Returns updated permissions.', type: PermissionUpdateResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID or unknown/unavailable permission keys', type: StandardErrorResponseDto })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'User not in your organisation or missing permission', type: StandardErrorResponseDto })
  async setPermissions(
    @Body() dto: SetPermissionsDto,
    @CurrentActor() actor: Actor,
  ) {
    return this.permissionsService.setUserPermissions(
      actor.organizationId!,
      dto.userId,
      dto.permissions,
      actor.userId,
    );
  }
}
