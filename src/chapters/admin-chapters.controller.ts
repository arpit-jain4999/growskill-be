import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse,
  ApiUnauthorizedResponse, ApiParam, ApiBearerAuth, ApiExtraModels,
} from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterResponseDto, ChapterApiResponseDto, ChapterListApiResponseDto } from './dto/chapter-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { PERMISSIONS } from '../common/constants/permissions';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ChapterResponseDto, CreateChapterDto, UpdateChapterDto)
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get('chapters')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_READ)
  @ApiOperation({
    summary: '[Admin] Get all chapters',
    description: 'Tenant-scoped. Returns all chapters (including inactive) for the organisation.',
  })
  @ApiOkResponse({ description: 'List of chapters', type: ChapterListApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor) {
    return this.chaptersService.findAllForAdmin(actor.organizationId!);
  }

  @Get('chapters/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_READ)
  @ApiOperation({ summary: '[Admin] Get chapter by ID', description: 'Tenant-scoped.' })
  @ApiParam({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Chapter found', type: ChapterApiResponseDto })
  @ApiNotFoundResponse({ description: 'Chapter not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid chapter ID', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.chaptersService.findByIdForAdmin(id, actor.organizationId!);
  }

  @Get('modules/:moduleId/chapters')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_READ)
  @ApiOperation({ summary: '[Admin] Get chapters by module ID', description: 'Tenant-scoped. Returns all chapters for a module.' })
  @ApiParam({ name: 'moduleId', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'List of chapters for the module', type: ChapterListApiResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async findByModule(@Param('moduleId') moduleId: string, @CurrentActor() actor: Actor) {
    return this.chaptersService.findByModuleIdForAdmin(moduleId, actor.organizationId!);
  }

  @Post('chapter')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_CREATE)
  @ApiOperation({
    summary: '[Admin] Create chapter',
    description: 'Creates a new chapter within a module. Provide moduleId in the body.',
  })
  @ApiCreatedResponse({ description: 'Chapter created', type: ChapterApiResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async create(@Body() dto: CreateChapterDto, @CurrentActor() actor: Actor) {
    return this.chaptersService.create(actor.organizationId!, dto);
  }

  @Patch('chapter/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_UPDATE)
  @ApiOperation({ summary: '[Admin] Update chapter', description: 'Partially update a chapter.' })
  @ApiParam({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Chapter updated', type: ChapterApiResponseDto })
  @ApiNotFoundResponse({ description: 'Chapter not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid chapter ID or validation error', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateChapterDto, @CurrentActor() actor: Actor) {
    return this.chaptersService.update(id, actor.organizationId!, dto);
  }

  @Delete('chapter/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.CHAPTER_DELETE)
  @ApiOperation({ summary: '[Admin] Delete chapter', description: 'Permanently deletes a chapter.' })
  @ApiParam({ name: 'id', description: 'Chapter ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Chapter deleted', type: ChapterApiResponseDto })
  @ApiNotFoundResponse({ description: 'Chapter not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid chapter ID', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.chaptersService.remove(id, actor.organizationId!);
  }
}
