import { BadRequestException, Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse,
  ApiUnauthorizedResponse, ApiParam, ApiBearerAuth,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard, RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';
import { PERMISSIONS } from '../common/constants/permissions';
import { ROLES } from '../common/constants/roles';
import { OrganizationsService } from '../organizations/organizations.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminCoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  private async resolveOrgId(
    actor: Actor,
    request: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } },
  ): Promise<string> {
    let orgId = actor.organizationId ?? null;
    if (!orgId && actor.role === ROLES.PLATFORM_OWNER && request?.headers) {
      const raw = request.headers['x-org-id'] ?? request.headers['X-Org-Id'];
      const trimmed = typeof raw === 'string' ? raw.trim() : '';
      if (trimmed) {
        await this.organizationsService.findById(trimmed);
        orgId = trimmed;
      }
    }
    if (!orgId) {
      throw new BadRequestException('x-org-id header required for this operation');
    }
    return orgId;
  }

  @Get('courses')
  @ApiOperation({ summary: '[Admin] Get all courses', description: 'Tenant-scoped. Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' })
  @ApiOkResponse({ description: 'List of all courses', type: [CourseResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.coursesService.findAllForAdmin(orgId);
  }

  @Get('courses/:id')
  @ApiOperation({ summary: '[Admin] Get course by ID', description: 'Any authenticated user in the org can read. PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course found', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.coursesService.findById(id, orgId);
  }

  @Post('course')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_CREATE)
  @ApiOperation({ summary: '[Admin] Create course', description: 'Creates a course. The authenticated user becomes the instructor. PLATFORM_OWNER must send x-org-id.' })
  @ApiCreatedResponse({ description: 'Course created', type: CourseResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error', type: StandardErrorResponseDto })
  async create(@Body() dto: CreateCourseDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.coursesService.create(orgId, actor.userId, dto);
  }

  @Patch('course/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_UPDATE)
  @ApiOperation({ summary: '[Admin] Update course', description: 'PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course updated', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.coursesService.update(id, orgId, dto);
  }

  @Delete('course/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_DELETE)
  @ApiOperation({ summary: '[Admin] Delete course', description: 'PLATFORM_OWNER must send x-org-id.' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course deleted', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor, @Req() req: { headers?: { 'x-org-id'?: string; 'X-Org-Id'?: string } }) {
    const orgId = await this.resolveOrgId(actor, req);
    return this.coursesService.remove(id, orgId);
  }
}
