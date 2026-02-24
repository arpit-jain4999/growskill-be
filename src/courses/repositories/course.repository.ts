import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';

export interface FindAllCoursesFilter {
  organizationId: string;
  name?: string;
  cohortId?: string;
}

@Injectable()
export class CourseRepository {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async findAll(filter: FindAllCoursesFilter): Promise<CourseDocument[]> {
    const query: Record<string, unknown> = {
      organizationId: new Types.ObjectId(filter.organizationId),
      isPublished: true,
    };
    if (filter.name?.trim()) {
      query.title = { $regex: filter.name.trim(), $options: 'i' };
    }
    if (filter.cohortId) {
      query.cohortId = new Types.ObjectId(filter.cohortId);
    }
    return this.courseModel.find(query);
  }

  async findAllForAdmin(organizationId: string): Promise<CourseDocument[]> {
    return this.courseModel
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .sort({ createdAt: -1 });
  }

  async findById(
    id: string,
    organizationId?: string,
  ): Promise<CourseDocument | null> {
    const q: Record<string, unknown> = { _id: id };
    if (organizationId) {
      q.organizationId = new Types.ObjectId(organizationId);
    }
    return this.courseModel.findOne(q);
  }

  async findByUserId(
    userId: string,
    organizationId: string,
  ): Promise<CourseDocument[]> {
    return this.courseModel.find({
      organizationId: new Types.ObjectId(organizationId),
      instructorId: new Types.ObjectId(userId),
    });
  }

  async create(data: Partial<Course>): Promise<CourseDocument> {
    return this.courseModel.create(data);
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<Course>,
  ): Promise<CourseDocument | null> {
    return this.courseModel
      .findOneAndUpdate(
        { _id: id, organizationId: new Types.ObjectId(organizationId) },
        { $set: data },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, organizationId: string): Promise<CourseDocument | null> {
    return this.courseModel
      .findOneAndDelete({ _id: id, organizationId: new Types.ObjectId(organizationId) })
      .exec();
  }
}

