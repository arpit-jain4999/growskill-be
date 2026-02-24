import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
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

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('courses')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_READ)
  @ApiOperation({ summary: '[Admin] Get all courses', description: 'Tenant-scoped. Includes published and unpublished.' })
  @ApiOkResponse({ description: 'List of all courses', type: [CourseResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor) {
    return this.coursesService.findAllForAdmin(actor.organizationId!);
  }

  @Get('courses/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_READ)
  @ApiOperation({ summary: '[Admin] Get course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course found', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.coursesService.findById(id, actor.organizationId!);
  }

  @Post('course')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_CREATE)
  @ApiOperation({ summary: '[Admin] Create course', description: 'Creates a course. The authenticated user becomes the instructor.' })
  @ApiCreatedResponse({ description: 'Course created', type: CourseResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error', type: StandardErrorResponseDto })
  async create(@Body() dto: CreateCourseDto, @CurrentActor() actor: Actor) {
    return this.coursesService.create(actor.organizationId!, actor.userId, dto);
  }

  @Patch('course/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_UPDATE)
  @ApiOperation({ summary: '[Admin] Update course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course updated', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentActor() actor: Actor) {
    return this.coursesService.update(id, actor.organizationId!, dto);
  }

  @Delete('course/:id')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.COURSE_DELETE)
  @ApiOperation({ summary: '[Admin] Delete course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOkResponse({ description: 'Course deleted', type: CourseResponseDto })
  @ApiNotFoundResponse({ description: 'Course not found', type: StandardErrorResponseDto })
  async remove(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.coursesService.remove(id, actor.organizationId!);
  }
}
