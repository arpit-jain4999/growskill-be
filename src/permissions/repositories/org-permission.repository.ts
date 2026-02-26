import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrgPermission, OrgPermissionDocument } from '../schemas/org-permission.schema';

@Injectable()
export class OrgPermissionRepository {
  constructor(
    @InjectModel(OrgPermission.name) private model: Model<OrgPermissionDocument>,
  ) {}

  async findByOrg(organizationId: string): Promise<OrgPermissionDocument[]> {
    return this.model
      .find({ organizationId: new Types.ObjectId(organizationId) })
      .sort({ permissionKey: 1 })
      .exec();
  }

  async findKeysByOrg(organizationId: string): Promise<string[]> {
    const docs = await this.findByOrg(organizationId);
    return docs.map((d) => d.permissionKey);
  }

  async hasKey(organizationId: string, permissionKey: string): Promise<boolean> {
    const doc = await this.model.findOne({
      organizationId: new Types.ObjectId(organizationId),
      permissionKey,
    });
    return !!doc;
  }

  async bulkInsert(
    organizationId: string,
    permissionKeys: string[],
    grantedBy: string,
  ): Promise<number> {
    const orgOid = new Types.ObjectId(organizationId);
    const grantedByOid = new Types.ObjectId(grantedBy);
    const ops = permissionKeys.map((key) => ({
      updateOne: {
        filter: { organizationId: orgOid, permissionKey: key },
        update: {
          $setOnInsert: {
            organizationId: orgOid,
            permissionKey: key,
            grantedAt: new Date(),
            grantedBy: grantedByOid,
          },
        },
        upsert: true,
      },
    }));
    if (ops.length === 0) return 0;
    const result = await this.model.bulkWrite(ops);
    return result.upsertedCount ?? 0;
  }

  async bulkRemove(organizationId: string, permissionKeys: string[]): Promise<number> {
    if (permissionKeys.length === 0) return 0;
    const result = await this.model.deleteMany({
      organizationId: new Types.ObjectId(organizationId),
      permissionKey: { $in: permissionKeys },
    });
    return result.deletedCount ?? 0;
  }

  async deleteAllByOrg(organizationId: string): Promise<number> {
    const result = await this.model.deleteMany({
      organizationId: new Types.ObjectId(organizationId),
    });
    return result.deletedCount ?? 0;
  }
}
