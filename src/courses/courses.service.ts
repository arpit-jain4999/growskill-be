import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('CoursesService');
  }

  async findAll() {
    this.logger.log('Fetching all courses');
    return this.courseRepository.findAll();
  }

  async findById(id: string) {
    this.logger.log(`Fetching course: ${id}`);
    const course = await this.courseRepository.findById(id);
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findMyCourses(userId: string) {
    this.logger.log(`Fetching courses for user: ${userId}`);
    return this.courseRepository.findByUserId(userId);
  }
}

