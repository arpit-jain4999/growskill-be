import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse,
  ApiUnauthorizedResponse, ApiParam, ApiBearerAuth, ApiExtraModels,
} from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleResponseDto, ModuleApiResponseDto, ModuleListApiResponseDto } from './dto/module-response.dto';
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
@ApiExtraModels(ModuleResponseDto, CreateModuleDto, UpdateModuleDto)
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get('modules')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_READ)
  @ApiOperation({
    summary: '[Admin] Get all modules',
    description: 'Tenant-scoped. Returns all modules (including inactive) for the organisation, sorted by display order.',
  })
  @ApiOkResponse({ description: 'List of all modules. Response: `{ success: true, data: ModuleResponseDto[] }`', type: ModuleListApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor) {
    return this.modulesService.findAllForAdmin(actor.organizationId!);
  }

  @Get('modules/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_READ)
  @ApiOperation({ summary: '[Admin] Get module by ID', description: 'Tenant-scoped. Returns a single module by ID.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module found. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.modulesService.findByIdForAdmin(id, actor.organizationId!);
  }

  @Post('module')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_CREATE)
  @ApiOperation({
    summary: '[Admin] Create module',
    description: 'Creates a new content module in the organisation. Optionally link to a course via courseId.',
  })
  @ApiCreatedResponse({ description: 'Module created. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Missing permission or tenant context', type: StandardErrorResponseDto })
  async create(@Body() dto: CreateModuleDto, @CurrentActor() actor: Actor) {
    return this.modulesService.create(actor.organizationId!, dto);
  }

  @Patch('module/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_UPDATE)
  @ApiOperation({ summary: '[Admin] Update module', description: 'Partially update a module. Only provided fields are changed.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module updated. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID or validation error', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto, @CurrentActor() actor: Actor) {
    return this.modulesService.update(id, actor.organizationId!, dto);
  }

  @Delete('module/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.MODULE_DELETE)
  @ApiOperation({ summary: '[Admin] Delete module', description: 'Permanently deletes a module from the organisation.' })
  @ApiParam({ name: 'id', description: 'Module ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Module deleted. Response: `{ success: true, data: ModuleResponseDto }`', type: ModuleApiResponseDto })
  @ApiNotFoundResponse({ description: 'Module not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid module ID', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.modulesService.remove(id, actor.organizationId!);
  }
}
