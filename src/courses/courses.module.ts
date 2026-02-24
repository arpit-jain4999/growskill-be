import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { AdminCoursesController } from './admin-courses.controller';
import { CoursesService } from './courses.service';
import { CourseRepository } from './repositories/course.repository';
import { Course, CourseSchema } from './schemas/course.schema';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    OrganizationsModule,
  ],
  controllers: [CoursesController, AdminCoursesController],
  providers: [CoursesService, CourseRepository],
  exports: [CoursesService],
})
export class CoursesModule {}

