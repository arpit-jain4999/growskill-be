import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileInfoDocument = FileInfo & Document;

// Note: This schema automatically includes:
// - _id: ObjectId (added by Mongoose by default)
// - createdAt: Date (added by timestamps: true)
// - updatedAt: Date (added by timestamps: true)
@Schema({ timestamps: true, _id: true })
export class FileInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  baseUrl: string;

  @Prop({ required: true })
  imgUrl: string; // baseUrl + key

  @Prop()
  mimeType?: string;

  @Prop()
  size?: number; // in bytes
}

export const FileInfoSchema = SchemaFactory.createForClass(FileInfo);

