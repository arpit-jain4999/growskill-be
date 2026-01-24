import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PreferenceDocument = Preference & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Preference {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);

