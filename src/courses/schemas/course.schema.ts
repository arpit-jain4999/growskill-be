import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CourseDocument = Course & Document;

const FeeSchema = new MongooseSchema(
  {
    amount: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
  },
  { _id: false },
);

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Course {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  instructorId: Types.ObjectId;

  @Prop({ type: FeeSchema, default: () => ({ amount: 0, discount: 0 }) })
  fee: { amount: number; discount: number };

  @Prop({ type: Types.ObjectId, ref: 'Cohort', required: false })
  cohortId?: Types.ObjectId;

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

  /** @deprecated Use fee.amount instead. Kept for backward compatibility during migration. */
  @Prop({ required: false })
  price?: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index({ organizationId: 1 });

CourseSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    const plain = ret as unknown as Record<string, unknown>;
    const fee = plain.fee as
      | { amount?: number; discount?: number }
      | undefined;
    if (fee && typeof fee.amount === 'number') {
      plain.fee = {
        amount: fee.amount,
        discount: fee.discount ?? 0,
        total: fee.amount - (fee.discount ?? 0),
      };
    } else if (typeof plain.price === 'number') {
      plain.fee = {
        amount: plain.price,
        discount: 0,
        total: plain.price,
      };
    }
    return ret;
  },
});