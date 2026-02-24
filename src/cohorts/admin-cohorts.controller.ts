import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
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

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminCohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Get('cohorts')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_READ)
  @ApiOperation({ summary: '[Admin] Get all cohorts', description: 'Tenant-scoped. Requires cohort:read.' })
  @ApiOkResponse({ description: 'List of all cohorts', type: [CohortResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden', type: StandardErrorResponseDto })
  async findAllForAdmin(@CurrentActor() actor: Actor) {
    return this.cohortsService.findAllForAdmin(actor.organizationId!);
  }

  @Get('cohorts/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_READ)
  @ApiOperation({ summary: '[Admin] Get cohort by ID', description: 'Tenant-scoped. Requires cohort:read.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort found', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  async findOneForAdmin(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.cohortsService.findByIdForAdmin(id, actor.organizationId!);
  }

  @Post('cohort')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_CREATE)
  @ApiOperation({ summary: '[Admin] Create cohort', description: 'Tenant-scoped. Requires cohort:create.' })
  @ApiCreatedResponse({ description: 'Cohort created', type: CohortResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request', type: StandardErrorResponseDto })
  async create(@Body() createCohortDto: CreateCohortDto, @CurrentActor() actor: Actor) {
    return this.cohortsService.create(actor.organizationId!, createCohortDto);
  }

  @Patch('cohort/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_UPDATE)
  @ApiOperation({ summary: '[Admin] Update cohort', description: 'Tenant-scoped. Requires cohort:update.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort updated', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto, @CurrentActor() actor: Actor) {
    return this.cohortsService.update(id, actor.organizationId!, updateCohortDto);
  }

  @Delete('cohort/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COHORT_DELETE)
  @ApiOperation({ summary: '[Admin] Soft delete cohort', description: 'Tenant-scoped. Requires cohort:delete.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort deleted', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  @ApiConflictResponse({ description: 'Cohort already inactive', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.cohortsService.remove(id, actor.organizationId!);
  }
}

