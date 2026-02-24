import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
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

@ApiTags('Cohorts')
@Controller('v1/cohorts')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard, AuthorizeGuard)
@Authorize(PERMISSIONS.COHORT_READ)
@ApiBearerAuth('JWT-auth')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active cohorts', description: 'Tenant-scoped. Requires cohort:read.' })
  @ApiOkResponse({ description: 'List of active cohorts', type: [CohortResponseDto] })
  async findAll(@CurrentActor() actor: Actor) {
    return this.cohortsService.findAll(actor.organizationId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cohort by ID', description: 'Tenant-scoped. Requires cohort:read.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ description: 'Cohort found', type: CohortResponseDto })
  @ApiNotFoundResponse({ description: 'Cohort not found', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.cohortsService.findById(id, actor.organizationId!);
  }
}
