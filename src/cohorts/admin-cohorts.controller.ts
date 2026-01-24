import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiBearerAuth, ApiCreatedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { CohortResponseDto } from './dto/cohort-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  /**
   * Admin: Get all cohorts (including inactive)
   */
  @Get('cohorts')
  @ApiOperation({ summary: '[Admin] Get all cohorts', description: 'Get list of all cohorts including inactive ones. Admin only.' })
  @ApiOkResponse({ 
    description: 'List of all cohorts',
    type: [CohortResponseDto],
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required',
    type: StandardErrorResponseDto,
  })
  async findAllForAdmin() {
    return this.cohortsService.findAllForAdmin();
  }

  /**
   * Admin: Get cohort by ID (including inactive)
   */
  @Get('cohorts/:id')
  @ApiOperation({ summary: '[Admin] Get cohort by ID', description: 'Get single cohort by ID including inactive. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ 
    description: 'Cohort found',
    type: CohortResponseDto,
  })
  @ApiNotFoundResponse({ 
    description: 'Cohort not found',
    type: StandardErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required',
    type: StandardErrorResponseDto,
  })
  async findOneForAdmin(@Param('id') id: string) {
    return this.cohortsService.findByIdForAdmin(id);
  }

  /**
   * Admin: Create new cohort
   */
  @Post('cohort')
  @ApiOperation({ summary: '[Admin] Create cohort', description: 'Create a new cohort. Admin only.' })
  @ApiCreatedResponse({ 
    description: 'Cohort created successfully',
    type: CohortResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid input data',
    type: StandardErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required',
    type: StandardErrorResponseDto,
  })
  async create(@Body() createCohortDto: CreateCohortDto) {
    return this.cohortsService.create(createCohortDto);
  }

  /**
   * Admin: Update cohort
   */
  @Patch('cohort/:id')
  @ApiOperation({ summary: '[Admin] Update cohort', description: 'Update an existing cohort. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ 
    description: 'Cohort updated successfully',
    type: CohortResponseDto,
  })
  @ApiNotFoundResponse({ 
    description: 'Cohort not found',
    type: StandardErrorResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid input data',
    type: StandardErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required',
    type: StandardErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto) {
    return this.cohortsService.update(id, updateCohortDto);
  }

  /**
   * Admin: Soft delete cohort (set isActive to false)
   */
  @Delete('cohort/:id')
  @ApiOperation({ summary: '[Admin] Soft delete cohort', description: 'Soft delete cohort by setting isActive to false. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiOkResponse({ 
    description: 'Cohort deleted successfully',
    type: CohortResponseDto,
  })
  @ApiNotFoundResponse({ 
    description: 'Cohort not found',
    type: StandardErrorResponseDto,
  })
  @ApiConflictResponse({ 
    description: 'Cohort already inactive',
    type: StandardErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required',
    type: StandardErrorResponseDto,
  })
  async remove(@Param('id') id: string) {
    return this.cohortsService.remove(id);
  }
}

