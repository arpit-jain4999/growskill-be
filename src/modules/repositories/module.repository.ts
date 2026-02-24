import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';

@Injectable()
export class ModuleRepository {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async findAll(): Promise<ModuleDocument[]> {
    return this.moduleModel.find({ isActive: true }).sort({ order: 1 });
  }

  async findAllForAdmin(organizationId: string): Promise<ModuleDocument[]> {
    return this.moduleModel
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .sort({ order: 1, createdAt: -1 });
  }

  async findById(id: string, organizationId?: string): Promise<ModuleDocument | null> {
    const q: Record<string, unknown> = { _id: id };
    if (organizationId) {
      q.organizationId = new Types.ObjectId(organizationId);
    }
    return this.moduleModel.findOne(q);
  }

  async findByCourseId(courseId: string): Promise<ModuleDocument[]> {
    return this.moduleModel.find({ 
      courseId: new Types.ObjectId(courseId),
      isActive: true 
    }).sort({ order: 1 });
  }

  async create(data: Partial<Module>): Promise<ModuleDocument> {
    return this.moduleModel.create(data);
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<Module>,
  ): Promise<ModuleDocument | null> {
    return this.moduleModel
      .findOneAndUpdate(
        { _id: id, organizationId: new Types.ObjectId(organizationId) },
        { $set: data },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, organizationId: string): Promise<ModuleDocument | null> {
    return this.moduleModel
      .findOneAndDelete({ _id: id, organizationId: new Types.ObjectId(organizationId) })
      .exec();
  }
}

