import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cohort, CohortDocument } from '../schemas/cohort.schema';

@Injectable()
export class CohortRepository {
  constructor(
    @InjectModel(Cohort.name) private cohortModel: Model<CohortDocument>,
  ) {}

  async findAll(organizationId: string): Promise<CohortDocument[]> {
    return this.cohortModel
      .find({
        organizationId: new Types.ObjectId(organizationId),
        isActive: true,
      })
      .sort({ displayOrder: 1, createdAt: -1 });
  }

  async findAllForAdmin(organizationId: string): Promise<CohortDocument[]> {
    return this.cohortModel
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .sort({ displayOrder: 1, createdAt: -1 });
  }

  async findById(
    id: string,
    organizationId?: string,
  ): Promise<CohortDocument | null> {
    const query: Record<string, unknown> = { _id: id };
    if (organizationId) {
      query.organizationId = new Types.ObjectId(organizationId);
    }
    return this.cohortModel.findOne(query);
  }

  async create(cohortData: Partial<Cohort>): Promise<CohortDocument> {
    return this.cohortModel.create(cohortData);
  }

  async update(
    id: string,
    organizationId: string,
    updateData: Partial<Cohort>,
  ): Promise<CohortDocument | null> {
    return this.cohortModel
      .findOneAndUpdate(
        { _id: id, organizationId: new Types.ObjectId(organizationId) },
        { $set: updateData },
        { new: true },
      )
      .exec();
  }

  async softDelete(
    id: string,
    organizationId: string,
  ): Promise<CohortDocument | null> {
    return this.cohortModel
      .findOneAndUpdate(
        { _id: id, organizationId: new Types.ObjectId(organizationId) },
        { isActive: false },
        { new: true },
      )
      .exec();
  }
}

