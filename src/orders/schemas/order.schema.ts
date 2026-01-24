import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course' })
  courseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cohort' })
  cohortId?: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  paymentId?: string;

  @Prop()
  paymentMethod?: string;

  @Prop()
  transactionId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1, createdAt: -1 });

