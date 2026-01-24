import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { CohortsService } from './cohorts.service';
import { CohortResponseDto } from './dto/cohort-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
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
  @ApiOkResponse({ 
    description: 'List of active cohorts',
    type: [CohortResponseDto],
  })
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
  @ApiOkResponse({ 
    description: 'Cohort found',
    type: CohortResponseDto,
  })
  @ApiNotFoundResponse({ 
    description: 'Cohort not found',
    type: StandardErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.cohortsService.findById(id);
  }
}
