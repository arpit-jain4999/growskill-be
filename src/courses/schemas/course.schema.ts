import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  instructorId: Types.ObjectId;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  enrollmentCount: number;

  @Prop()
  thumbnail?: string;

  @Prop()
  category?: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalRatings: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

