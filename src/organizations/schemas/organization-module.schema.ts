import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationModuleDocument = OrganizationModule & Document;

/**
 * Tracks which modules (e.g. courses, cohorts) are enabled for an organization.
 * When enabled, SUPER_ADMIN gets full permissions for that module and can grant to others.
 */
@Schema({ timestamps: true })
export class OrganizationModule {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true })
  moduleKey: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: Date.now })
  enabledAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  enabledByUserId: Types.ObjectId;
}

export const OrganizationModuleSchema =
  SchemaFactory.createForClass(OrganizationModule);

OrganizationModuleSchema.index(
  { organizationId: 1, moduleKey: 1 },
  { unique: true },
);
