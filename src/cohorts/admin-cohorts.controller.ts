import { BadRequestException, Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiBearerAuth, ApiCreatedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { CohortResponseDto } from './dto/cohort-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard } from '../common/guards/tenant-context.guard';
import { RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { PERMISSIONS } from '../common/constants/permissions';
import { ROLES } from '../common/constants/roles';
import { OrganizationsService } from '../organizations/organizations.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminCohortsController {
  constructor(
    private readonly cohortsService: CohortsService,
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

  @Get('cohorts')
  @ApiOperation({ summary: '[Admin] Get all cohorts', description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' })
  @ApiOkResponse({ description: 'List of all cohorts', type: [CohortResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden', type: StandardErrorResponseDto })
  async findAllForAdmin(@CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.cohortsService.findAllForAdmin(orgId);
  }

  @Get('cohorts/:id')
  @ApiOperation({ summary: '[Admin] Get cohort by ID', description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort found', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  async findOneForAdmin(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.cohortsService.findByIdForAdmin(id, orgId);
  }

  @Post('cohort')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_CREATE)
  @ApiOperation({ summary: '[Admin] Create cohort', description: 'Tenant-scoped. Requires cohort:create. PLATFORM_OWNER must send x-org-id.' })
  @ApiCreatedResponse({ description: 'Cohort created', type: CohortResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request', type: StandardErrorResponseDto })
  async create(@Body() createCohortDto: CreateCohortDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.cohortsService.create(orgId, createCohortDto);
  }

  @Patch('cohort/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_UPDATE)
  @ApiOperation({ summary: '[Admin] Update cohort', description: 'Tenant-scoped. Requires cohort:update. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort updated', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.cohortsService.update(id, orgId, updateCohortDto);
  }

  @Delete('cohort/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_DELETE)
  @ApiOperation({ summary: '[Admin] Soft delete cohort', description: 'Tenant-scoped. Requires cohort:delete. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort deleted', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  @ApiConflictResponse({ description: 'Cohort already inactive', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.cohortsService.remove(id, orgId);
  }
}

