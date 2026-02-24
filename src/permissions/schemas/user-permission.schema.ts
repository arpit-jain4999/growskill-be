import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserPermissionDocument = UserPermission & Document;

/**
 * Tracks which permission keys have been explicitly granted to a user
 * within an organization. Replaces the embedded permissions[] on User.
 */
@Schema({ timestamps: true })
export class UserPermission {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  permissionKey: string;

  @Prop({ default: Date.now })
  grantedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  grantedBy: Types.ObjectId;
}

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);

UserPermissionSchema.index(
  { organizationId: 1, userId: 1, permissionKey: 1 },
  { unique: true },
);
UserPermissionSchema.index({ organizationId: 1, userId: 1 });
