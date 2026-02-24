import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse,
  ApiBadRequestResponse, ApiParam, ApiExtraModels, ApiBearerAuth,
} from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { ChapterResponseDto, ChapterApiResponseDto, ChapterListApiResponseDto } from './dto/chapter-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@ApiTags('Chapters')
@ApiExtraModels(ChapterResponseDto)
@Controller('v1/chapters')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard, AuthorizeGuard)
@Authorize(PERMISSIONS.CHAPTER_READ)
@ApiBearerAuth('JWT-auth')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active chapters', description: 'Requires chapter:read permission.' })
  @ApiOkResponse({ description: 'List of active chapters', type: ChapterListApiResponseDto })
  async findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chapter by ID', description: 'Requires chapter:read.' })
  @ApiParam({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)' })
  @ApiOkResponse({ description: 'Chapter found', type: ChapterApiResponseDto })
  @ApiNotFoundResponse({ description: 'Chapter not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid chapter ID', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string) {
    return this.chaptersService.findById(id);
  }

  @Get('module/:moduleId')
  @ApiOperation({ summary: 'Get chapters by module ID', description: 'Returns all active chapters for a module, sorted by order. Requires chapter:read.' })
  @ApiParam({ name: 'moduleId', description: 'Module ID (MongoDB ObjectId)' })
  @ApiOkResponse({ description: 'List of chapters for the module', type: ChapterListApiResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async findByModule(@Param('moduleId') moduleId: string) {
    return this.chaptersService.findByModuleId(moduleId);
  }
}
