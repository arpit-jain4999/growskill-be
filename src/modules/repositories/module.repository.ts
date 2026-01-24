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

  async findById(id: string): Promise<ModuleDocument | null> {
    return this.moduleModel.findById(id);
  }

  async findByCourseId(courseId: string): Promise<ModuleDocument[]> {
    return this.moduleModel.find({ 
      courseId: new Types.ObjectId(courseId),
      isActive: true 
    }).sort({ order: 1 });
  }
}

