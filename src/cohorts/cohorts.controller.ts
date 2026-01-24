import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Cohorts')
@Controller('v1/cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  /**
   * Public: Get all active cohorts
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active cohorts', description: 'Get list of all active cohorts. Public endpoint.' })
  @ApiResponse({ status: 200, description: 'List of active cohorts' })
  async findAll() {
    return this.cohortsService.findAll();
  }

  /**
   * Public: Get cohort by ID (only active)
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get cohort by ID', description: 'Get single active cohort by ID. Public endpoint.' })
  @ApiParam({ name: 'id', description: 'Cohort ID' })
  @ApiResponse({ status: 200, description: 'Cohort found' })
  @ApiResponse({ status: 404, description: 'Cohort not found' })
  async findOne(@Param('id') id: string) {
    return this.cohortsService.findById(id);
  }
}
