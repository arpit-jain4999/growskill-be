import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isUsed: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Create TTL index to auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create compound index for countryCode + phoneNumber
OtpSchema.index({ countryCode: 1, phoneNumber: 1 });

