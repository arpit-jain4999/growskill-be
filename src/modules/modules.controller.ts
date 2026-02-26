import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse,
  ApiBadRequestResponse, ApiParam, ApiExtraModels, ApiBearerAuth,
} from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { ModuleResponseDto, ModuleApiResponseDto, ModuleListApiResponseDto } from './dto/module-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';

@ApiTags('Modules')
@ApiExtraModels(ModuleResponseDto)
@Controller('v1/modules')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
@ApiBearerAuth('JWT-auth')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all active modules',
    description: 'Returns all active modules sorted by display order. Any authenticated user in the org can read.',
  })
  @ApiOkResponse({ description: 'List of active modules', type: ModuleListApiResponseDto })
  async findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get module by ID', description: 'Returns a single module by its ID. Any authenticated user in the org can read.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)' })
  @ApiOkResponse({ description: 'Module found', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string) {
    return this.modulesService.findById(id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get modules by course ID', description: 'Returns all active modules for a given course, sorted by display order. Any authenticated user in the org can read.' })
  @ApiParam({ name: 'courseId', description: 'Course ID (MongoDB ObjectId)' })
  @ApiOkResponse({ description: 'List of modules for the course', type: ModuleListApiResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid course ID', type: StandardErrorResponseDto })
  async findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourseId(courseId);
  }
}
