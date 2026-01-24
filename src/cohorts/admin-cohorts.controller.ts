import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
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
  @ApiResponse({ status: 200, description: 'List of all cohorts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAllForAdmin() {
    return this.cohortsService.findAllForAdmin();
  }

  /**
   * Admin: Get cohort by ID (including inactive)
   */
  @Get('cohorts/:id')
  @ApiOperation({ summary: '[Admin] Get cohort by ID', description: 'Get single cohort by ID including inactive. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiResponse({ status: 200, description: 'Cohort found' })
  @ApiResponse({ status: 404, description: 'Cohort not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findOneForAdmin(@Param('id') id: string) {
    return this.cohortsService.findByIdForAdmin(id);
  }

  /**
   * Admin: Create new cohort
   */
  @Post('cohort')
  @ApiOperation({ summary: '[Admin] Create cohort', description: 'Create a new cohort. Admin only.' })
  @ApiResponse({ status: 201, description: 'Cohort created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createCohortDto: CreateCohortDto) {
    return this.cohortsService.create(createCohortDto);
  }

  /**
   * Admin: Update cohort
   */
  @Patch('cohort/:id')
  @ApiOperation({ summary: '[Admin] Update cohort', description: 'Update an existing cohort. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiResponse({ status: 200, description: 'Cohort updated successfully' })
  @ApiResponse({ status: 404, description: 'Cohort not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto) {
    return this.cohortsService.update(id, updateCohortDto);
  }

  /**
   * Admin: Soft delete cohort (set isActive to false)
   */
  @Delete('cohort/:id')
  @ApiOperation({ summary: '[Admin] Soft delete cohort', description: 'Soft delete cohort by setting isActive to false. Admin only.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiResponse({ status: 200, description: 'Cohort deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cohort not found' })
  @ApiResponse({ status: 409, description: 'Cohort already inactive' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async remove(@Param('id') id: string) {
    return this.cohortsService.remove(id);
  }
}

