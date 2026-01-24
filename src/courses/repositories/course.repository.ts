import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async findAll(): Promise<CourseDocument[]> {
    return this.courseModel.find({ isPublished: true });
  }

  async findById(id: string): Promise<CourseDocument | null> {
    return this.courseModel.findById(id);
  }

  async findByUserId(userId: string): Promise<CourseDocument[]> {
    return this.courseModel.find({ instructorId: new Types.ObjectId(userId) });
  }
}

