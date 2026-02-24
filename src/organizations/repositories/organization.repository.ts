import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectModel(Organization.name)
    private orgModel: Model<OrganizationDocument>,
  ) {}

  async create(data: Partial<Organization>): Promise<OrganizationDocument> {
    const doc = await this.orgModel.create(data);
    return doc;
  }

  async findAll(): Promise<OrganizationDocument[]> {
    return this.orgModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<OrganizationDocument | null> {
    return this.orgModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<Organization>,
  ): Promise<OrganizationDocument | null> {
    return this.orgModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }
}
