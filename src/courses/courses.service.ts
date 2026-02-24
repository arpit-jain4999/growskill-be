import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CourseRepository } from './repositories/course.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('CoursesService');
  }

  async findAll(filter: {
    organizationId: string;
    name?: string;
    cohortId?: string;
  }) {
    this.logger.log('Fetching all courses', JSON.stringify(filter));
    return this.courseRepository.findAll(filter);
  }

  async findAllForAdmin(organizationId: string) {
    this.logger.log('Fetching all courses for admin');
    return this.courseRepository.findAllForAdmin(organizationId);
  }

  async findById(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID');
    }
    this.logger.log(`Fetching course: ${id}`);
    const course = await this.courseRepository.findById(id, organizationId);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async findMyCourses(userId: string, organizationId: string) {
    this.logger.log(`Fetching courses for user: ${userId}`);
    return this.courseRepository.findByUserId(userId, organizationId);
  }

  async create(organizationId: string, instructorId: string, dto: CreateCourseDto) {
    this.logger.log(`Creating course: ${dto.title}`);
    const data: Record<string, unknown> = {
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      instructorId: new Types.ObjectId(instructorId),
    };
    if (dto.cohortId) {
      data.cohortId = new Types.ObjectId(dto.cohortId);
    }
    const course = await this.courseRepository.create(data);
    this.logger.log(`Course created: ${course._id}`);
    return course;
  }

  async update(id: string, organizationId: string, dto: UpdateCourseDto) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid course ID');
    this.logger.log(`Updating course: ${id}`);
    const existing = await this.courseRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Course not found');
    const data: Record<string, unknown> = { ...dto };
    if (dto.cohortId) {
      data.cohortId = new Types.ObjectId(dto.cohortId);
    }
    const updated = await this.courseRepository.update(id, organizationId, data);
    this.logger.log(`Course updated: ${id}`);
    return updated;
  }

  async remove(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid course ID');
    this.logger.log(`Deleting course: ${id}`);
    const existing = await this.courseRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Course not found');
    const deleted = await this.courseRepository.delete(id, organizationId);
    this.logger.log(`Course deleted: ${id}`);
    return deleted;
  }
}

