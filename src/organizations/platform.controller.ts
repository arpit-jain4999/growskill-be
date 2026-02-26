import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard } from '../common/guards/tenant-context.guard';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { ROLES } from '../common/constants/roles';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  AssignSuperAdminDto,
} from './dto/create-organization.dto';

/**
 * Platform owner endpoints. Only PLATFORM_OWNER can access.
 * Not tenant-scoped.
 */
@ApiTags('Platform')
@Controller('v1/platform/orgs')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth('JWT-auth')
export class PlatformController {
  constructor(private organizationsService: OrganizationsService) {}

  private ensurePlatformOwner(actor: Actor): void {
    if (actor.role !== ROLES.PLATFORM_OWNER) {
      throw new ForbiddenException('Platform owner access required');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create organization' })
  async create(@Body() dto: CreateOrganizationDto, @CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.create(dto);
  }

  @Post('with-super-admin')
  @ApiOperation({ summary: 'Create organization and assign initial SUPER_ADMIN' })
  async createWithSuperAdmin(
    @Body() body: { organization: CreateOrganizationDto; superAdmin: AssignSuperAdminDto },
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.createWithSuperAdmin(
      body.organization,
      body.superAdmin,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async list(@CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.findAll();
  }

  @Get('module-keys')
  @ApiOperation({ summary: 'List available feature modules and their permissions (for dashboard)' })
  getModuleKeys(@CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.getAvailableModuleKeys();
  }

  @Get(':orgId')
  @ApiOperation({ summary: 'Get organization by ID' })
  async get(@Param('orgId') orgId: string, @CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.findById(orgId);
  }

  @Get(':orgId/users')
  @ApiOperation({ summary: 'List users in an organisation (for PLATFORM_OWNER dashboard)' })
  async getOrgUsers(@Param('orgId') orgId: string, @CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.findUsersByOrg(orgId);
  }

  @Get(':orgId/modules')
  @ApiOperation({ summary: 'List feature modules and their enabled state for an organisation' })
  async getOrgModules(@Param('orgId') orgId: string, @CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    await this.organizationsService.findById(orgId);
    return this.organizationsService.getModulesForOrg(orgId);
  }

  @Post(':orgId/modules/:moduleKey/enable')
  @ApiOperation({ summary: 'Enable a feature module for an organisation (grants permissions to SUPER_ADMIN)' })
  async enableOrgModule(
    @Param('orgId') orgId: string,
    @Param('moduleKey') moduleKey: string,
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    await this.organizationsService.findById(orgId);
    await this.organizationsService.enableModule(orgId, moduleKey, actor.userId);
    return { enabled: moduleKey };
  }

  @Post(':orgId/modules/:moduleKey/disable')
  @ApiOperation({ summary: 'Disable a feature module for an organisation' })
  async disableOrgModule(
    @Param('orgId') orgId: string,
    @Param('moduleKey') moduleKey: string,
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    await this.organizationsService.findById(orgId);
    await this.organizationsService.disableModule(orgId, moduleKey);
    return { disabled: moduleKey };
  }

  @Patch(':orgId/users/:userId/role')
  @ApiOperation({ summary: 'Set user role in organisation (e.g. promote to SUPER_ADMIN)' })
  async setUserRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.setUserRoleByPlatform(orgId, userId, body.role);
  }

  @Patch(':orgId')
  @ApiOperation({ summary: 'Update organization' })
  async update(
    @Param('orgId') orgId: string,
    @Body() dto: Partial<CreateOrganizationDto>,
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.update(orgId, dto);
  }

  @Delete(':orgId')
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Permanently deletes the organization and all associated data (users, cohorts, courses, modules, chapters, orders, permissions). PLATFORM_OWNER only.',
  })
  async delete(@Param('orgId') orgId: string, @CurrentActor() actor: Actor) {
    this.ensurePlatformOwner(actor);
    await this.organizationsService.remove(orgId);
    return { deleted: orgId };
  }

  @Post(':orgId/super-admin')
  @ApiOperation({ summary: 'Assign initial SUPER_ADMIN to organization' })
  async assignSuperAdmin(
    @Param('orgId') orgId: string,
    @Body() dto: AssignSuperAdminDto,
    @CurrentActor() actor: Actor,
  ) {
    this.ensurePlatformOwner(actor);
    return this.organizationsService.assignInitialSuperAdmin(orgId, dto);
  }
}
