import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export const USER_ROLES = [
  'PLATFORM_OWNER',
  'SUPER_ADMIN',
  'ADMIN',
  'USER',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class User {
  /** Tenant scope. Null for PLATFORM_OWNER only. */
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  organizationId?: Types.ObjectId;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  email?: string;

  @Prop()
  name?: string;

  @Prop({ default: 'USER', enum: USER_ROLES })
  role: UserRole;

  /**
   * @deprecated User permissions are now stored in the UserPermission collection.
   * This field is kept temporarily for migration compatibility; do not write to it.
   */
  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Tenant-scoped index: all queries filter by organizationId
UserSchema.index({ organizationId: 1 });

// Unique per org: one user per (org, email) only when email is a real string (multiple users can have no email)
UserSchema.index(
  { organizationId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: 'string' } },
  },
);
// Unique per org: one user per (org, phone)
UserSchema.index(
  { organizationId: 1, countryCode: 1, phoneNumber: 1 },
  { unique: true },
);
// Note: global phone uniqueness for platform-level users (no org) is enforced by
// the organizationId_1_countryCode_1_phoneNumber_1 compound index (organizationId=null counts as a value).
// Non-unique lookup index for phone-based queries without org filter:
UserSchema.index({ countryCode: 1, phoneNumber: 1 });

