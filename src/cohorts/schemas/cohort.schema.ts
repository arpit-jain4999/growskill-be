import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileInfo, FileInfoSchema } from '../../common/schemas/file.schema';

export type CohortDocument = Cohort & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Cohort {
  @Prop({ required: true })
  name: string;

  @Prop({ type: { mobile: FileInfoSchema, web: FileInfoSchema }, _id: false })
  icon?: {
    mobile?: FileInfo;
    web?: FileInfo;
  };

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ required: true, default: 'IN' })
  countryCode: string;

  @Prop({ default: false })
  isVisibleOnHomePage: boolean;

  @Prop()
  description?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  maxParticipants?: number;

  @Prop({ default: 0 })
  currentParticipants: number;
}

export const CohortSchema = SchemaFactory.createForClass(Cohort);

