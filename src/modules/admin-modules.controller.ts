import { BadRequestException, Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse,
  ApiUnauthorizedResponse, ApiParam, ApiBearerAuth, ApiExtraModels,
} from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleResponseDto, ModuleApiResponseDto, ModuleListApiResponseDto } from './dto/module-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { PERMISSIONS } from '../common/constants/permissions';
import { ROLES } from '../common/constants/roles';
import { OrganizationsService } from '../organizations/organizations.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ModuleResponseDto, CreateModuleDto, UpdateModuleDto)
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  private async resolveOrgId(
    actor: Actor,
    request: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } },
  ): Promise<string> {
    let orgId = actor.organizationId ?? null;
    if (!orgId && actor.role === ROLES.PLATFORM_OWNER && request?.headers) {
      const raw = request.headers['x-org-id'] ?? request.headers['X-Org-Id'];
      const trimmed = typeof raw === 'string' ? raw.trim() : '';
      if (trimmed) {
        await this.organizationsService.findById(trimmed);
        orgId = trimmed;
      }
    }
    if (!orgId) {
      throw new BadRequestException('x-org-id header required for this operation');
    }
    return orgId;
  }

  @Get('modules')
  @ApiOperation({
    summary: '[Admin] Get all modules',
    description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.',
  })
  @ApiOkResponse({ description: 'List of all modules. Response: `{ success: true, data: ModuleResponseDto[] }`', type: ModuleListApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.modulesService.findAllForAdmin(orgId);
  }

  @Get('modules/:id')
  @ApiOperation({ summary: '[Admin] Get module by ID', description: 'Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module found. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.modulesService.findByIdForAdmin(id, orgId);
  }

  @Post('module')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_CREATE)
  @ApiOperation({
    summary: '[Admin] Create module',
    description: 'Creates a new content module in the organisation. PLATFORM_OWNER must send x-org-id.',
  })
  @ApiCreatedResponse({ description: 'Module created. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async create(@Body() dto: CreateModuleDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.modulesService.create(orgId, dto);
  }

  @Patch('module/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_UPDATE)
  @ApiOperation({ summary: '[Admin] Update module', description: 'Partially update a module. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module updated. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID or validation error', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.modulesService.update(id, orgId, dto);
  }

  @Delete('module/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_DELETE)
  @ApiOperation({ summary: '[Admin] Delete module', description: 'Permanently deletes a module. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module deleted. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.modulesService.remove(id, orgId);
  }
}
