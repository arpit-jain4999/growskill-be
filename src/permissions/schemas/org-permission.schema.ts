import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrgPermissionDocument = OrgPermission & Document;

/**
 * Tracks which permission keys are available for an organization.
 * Populated when a feature module is enabled; removed when disabled.
 */
@Schema({ timestamps: true })
export class OrgPermission {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true })
  permissionKey: string;

  @Prop({ default: Date.now })
  grantedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  grantedBy: Types.ObjectId;
}

export const OrgPermissionSchema = SchemaFactory.createForClass(OrgPermission);

OrgPermissionSchema.index(
  { organizationId: 1, permissionKey: 1 },
  { unique: true },
);
