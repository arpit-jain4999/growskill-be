import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChapterDocument = Chapter & Document;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  moduleId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  /** Rich-text / markdown content for text-based chapters */
  @Prop()
  content?: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  pdfUrl?: string;

  @Prop()
  thumbnail?: string;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ enum: ['video', 'pdf', 'text', 'mixed'], default: 'text' })
  contentType: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
ChapterSchema.index({ organizationId: 1 });
ChapterSchema.index({ moduleId: 1, order: 1 });
