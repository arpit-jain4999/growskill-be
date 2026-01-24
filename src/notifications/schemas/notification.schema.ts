import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  message?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  type?: string;

  @Prop()
  link?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, isRead: 1 });

