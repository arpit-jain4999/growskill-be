import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cohort, CohortDocument } from '../schemas/cohort.schema';

@Injectable()
export class CohortRepository {
  constructor(
    @InjectModel(Cohort.name) private cohortModel: Model<CohortDocument>,
  ) {}

  async findAll(): Promise<CohortDocument[]> {
    return this.cohortModel.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
  }

  async findAllForAdmin(): Promise<CohortDocument[]> {
    return this.cohortModel.find().sort({ displayOrder: 1, createdAt: -1 });
  }

  async findById(id: string): Promise<CohortDocument | null> {
    return this.cohortModel.findById(id);
  }

  async create(cohortData: Partial<Cohort>): Promise<CohortDocument> {
    return this.cohortModel.create(cohortData);
  }

  async update(id: string, updateData: Partial<Cohort>): Promise<CohortDocument | null> {
    return this.cohortModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async softDelete(id: string): Promise<CohortDocument | null> {
    return this.cohortModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }
}

