import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserPermission, UserPermissionDocument } from '../schemas/user-permission.schema';

@Injectable()
export class UserPermissionRepository {
  constructor(
    @InjectModel(UserPermission.name) private model: Model<UserPermissionDocument>,
  ) {}

  async findByUser(organizationId: string, userId: string): Promise<UserPermissionDocument[]> {
    return this.model
      .find({
        organizationId: new Types.ObjectId(organizationId),
        userId: new Types.ObjectId(userId),
      })
      .sort({ permissionKey: 1 })
      .exec();
  }

  async findKeysByUser(organizationId: string, userId: string): Promise<string[]> {
    const docs = await this.findByUser(organizationId, userId);
    return docs.map((d) => d.permissionKey);
  }

  async grant(
    organizationId: string,
    userId: string,
    permissionKeys: string[],
    grantedBy: string,
  ): Promise<number> {
    const orgOid = new Types.ObjectId(organizationId);
    const userOid = new Types.ObjectId(userId);
    const grantedByOid = new Types.ObjectId(grantedBy);
    const ops = permissionKeys.map((key) => ({
      updateOne: {
        filter: { organizationId: orgOid, userId: userOid, permissionKey: key },
        update: {
          $setOnInsert: {
            organizationId: orgOid,
            userId: userOid,
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

  async revoke(
    organizationId: string,
    userId: string,
    permissionKeys: string[],
  ): Promise<number> {
    if (permissionKeys.length === 0) return 0;
    const result = await this.model.deleteMany({
      organizationId: new Types.ObjectId(organizationId),
      userId: new Types.ObjectId(userId),
      permissionKey: { $in: permissionKeys },
    });
    return result.deletedCount ?? 0;
  }

  async replaceAll(
    organizationId: string,
    userId: string,
    permissionKeys: string[],
    grantedBy: string,
  ): Promise<void> {
    const orgOid = new Types.ObjectId(organizationId);
    const userOid = new Types.ObjectId(userId);

    await this.model.deleteMany({
      organizationId: orgOid,
      userId: userOid,
    });

    if (permissionKeys.length === 0) return;

    const grantedByOid = new Types.ObjectId(grantedBy);
    const docs = permissionKeys.map((key) => ({
      organizationId: orgOid,
      userId: userOid,
      permissionKey: key,
      grantedAt: new Date(),
      grantedBy: grantedByOid,
    }));
    await this.model.insertMany(docs);
  }

  async deleteAllByOrg(organizationId: string): Promise<number> {
    const result = await this.model.deleteMany({
      organizationId: new Types.ObjectId(organizationId),
    });
    return result.deletedCount ?? 0;
  }
}
