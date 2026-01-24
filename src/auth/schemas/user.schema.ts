import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true })
export class User {
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

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create compound unique index for countryCode + phoneNumber
UserSchema.index({ countryCode: 1, phoneNumber: 1 }, { unique: true });

