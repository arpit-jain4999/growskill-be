import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OrganizationModule as OrgModuleSchema,
  OrganizationModuleDocument,
} from '../schemas/organization-module.schema';

@Injectable()
export class OrganizationModuleRepository {
  constructor(
    @InjectModel(OrgModuleSchema.name)
    private model: Model<OrganizationModuleDocument>,
  ) {}

  async findEnabledByOrg(organizationId: string): Promise<OrganizationModuleDocument[]> {
    return this.model
      .find({ organizationId: new Types.ObjectId(organizationId), enabled: true })
      .exec();
  }

  /** All module records for an org (enabled and disabled). */
  async findAllByOrg(organizationId: string): Promise<OrganizationModuleDocument[]> {
    return this.model
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .exec();
  }

  async disable(organizationId: string, moduleKey: string): Promise<OrganizationModuleDocument | null> {
    const doc = await this.model.findOne({
      organizationId: new Types.ObjectId(organizationId),
      moduleKey,
    });
    if (!doc) return null;
    doc.enabled = false;
    return doc.save();
  }

  async enable(
    organizationId: string,
    moduleKey: string,
    enabledByUserId: string,
  ): Promise<OrganizationModuleDocument> {
    const existing = await this.model.findOne({
      organizationId: new Types.ObjectId(organizationId),
      moduleKey,
    });
    if (existing) {
      existing.enabled = true;
      existing.enabledAt = new Date();
      existing.enabledByUserId = new Types.ObjectId(enabledByUserId);
      return existing.save();
    }
    return this.model.create({
      organizationId: new Types.ObjectId(organizationId),
      moduleKey,
      enabled: true,
      enabledAt: new Date(),
      enabledByUserId: new Types.ObjectId(enabledByUserId),
    });
  }

  async isEnabled(organizationId: string, moduleKey: string): Promise<boolean> {
    const doc = await this.model.findOne({
      organizationId: new Types.ObjectId(organizationId),
      moduleKey,
      enabled: true,
    });
    return !!doc;
  }

  async deleteByOrg(organizationId: string): Promise<number> {
    const result = await this.model.deleteMany({
      organizationId: new Types.ObjectId(organizationId),
    });
    return result.deletedCount ?? 0;
  }
}
