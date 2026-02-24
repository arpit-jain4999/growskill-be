import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';

@Injectable()
export class ChapterRepository {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
  ) {}

  async findAll(): Promise<ChapterDocument[]> {
    return this.chapterModel.find({ isActive: true }).sort({ order: 1 });
  }

  async findAllForAdmin(organizationId: string): Promise<ChapterDocument[]> {
    return this.chapterModel
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .sort({ order: 1, createdAt: -1 });
  }

  async findById(id: string, organizationId?: string): Promise<ChapterDocument | null> {
    const q: Record<string, unknown> = { _id: id };
    if (organizationId) {
      q.organizationId = new Types.ObjectId(organizationId);
    }
    return this.chapterModel.findOne(q);
  }

  async findByModuleId(moduleId: string): Promise<ChapterDocument[]> {
    return this.chapterModel
      .find({ moduleId: new Types.ObjectId(moduleId), isActive: true })
      .sort({ order: 1 });
  }

  async findByModuleIdForAdmin(moduleId: string, organizationId: string): Promise<ChapterDocument[]> {
    return this.chapterModel
      .find({
        moduleId: new Types.ObjectId(moduleId),
        organizationId: new Types.ObjectId(organizationId),
      })
      .sort({ order: 1, createdAt: -1 });
  }

  async create(data: Partial<Chapter>): Promise<ChapterDocument> {
    return this.chapterModel.create(data);
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<Chapter>,
  ): Promise<ChapterDocument | null> {
    return this.chapterModel
      .findOneAndUpdate(
        { _id: id, organizationId: new Types.ObjectId(organizationId) },
        { $set: data },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, organizationId: string): Promise<ChapterDocument | null> {
    return this.chapterModel
      .findOneAndDelete({ _id: id, organizationId: new Types.ObjectId(organizationId) })
      .exec();
  }

  async deleteByModuleId(moduleId: string, organizationId: string): Promise<number> {
    const result = await this.chapterModel.deleteMany({
      moduleId: new Types.ObjectId(moduleId),
      organizationId: new Types.ObjectId(organizationId),
    });
    return result.deletedCount ?? 0;
  }
}
