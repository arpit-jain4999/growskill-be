import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
  CourseApiResponseDto,
  CourseListApiResponseDto,
  CourseResponseDto,
  FeeDto,
} from './dto/course-response.dto';
import { FindAllCoursesQueryDto } from './dto/find-all-courses-query.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard } from '../common/guards/tenant-context.guard';
import { RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { Actor } from '../common/types/actor';

@ApiTags('Courses')
@ApiExtraModels(CourseResponseDto, FeeDto, FindAllCoursesQueryDto)
@Controller('v1/courses')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
@ApiBearerAuth('JWT-auth')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all published courses',
    description:
      'Returns all published courses. Optional query params: **name** (search by course title, case-insensitive) and **cohortId** (filter by cohort). Any authenticated user in the org can read.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by course name (title). Case-insensitive partial match.',
    example: 'Node.js',
  })
  @ApiQuery({
    name: 'cohortId',
    required: false,
    type: String,
    description: 'Filter courses by cohort ID (MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description:
      'List of published courses. Response: `{ success: true, data: Course[] }`. Each course includes _id, title, description, fee (amount, discount, total), cohortId, isPublished, enrollmentCount, thumbnail, category, rating, totalRatings, createdAt, updatedAt.',
    type: CourseListApiResponseDto,
  })
  async findAll(
    @Query() query: FindAllCoursesQueryDto,
    @CurrentActor() actor: Actor,
  ) {
    return this.coursesService.findAll({
      organizationId: actor.organizationId!,
      name: query.name,
      cohortId: query.cohortId,
    });
  }

  @Get('my-courses')
  @ApiOperation({
    summary: 'Get my courses',
    description: 'Returns courses for the authenticated user (instructor). Requires JWT.',
  })
  @ApiOkResponse({
    description: 'List of courses for the current user. API response format: { success, data }.',
    type: CourseListApiResponseDto,
  })
  async findMyCourses(@CurrentActor() actor: Actor) {
    return this.coursesService.findMyCourses(
      actor.userId,
      actor.organizationId!,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get course by ID',
    description: 'Tenant-scoped. Returns a single published course by ID.',
  })
  @ApiParam({ name: 'id', description: 'Course ID (MongoDB ObjectId)' })
  @ApiOkResponse({
    description: 'Course found. API response format: { success, data }.',
    type: CourseApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Course not found',
    type: StandardErrorResponseDto,
  })
  async findOne(@Param('id') id: string, @CurrentActor() actor: Actor) {
    return this.coursesService.findById(id, actor.organizationId!);
  }
}

