import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoProcessingDocument = VideoProcessing & Document;

export const VIDEO_PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type VideoProcessingStatus = (typeof VIDEO_PROCESSING_STATUS)[keyof typeof VIDEO_PROCESSING_STATUS];

@Schema({ timestamps: true })
export class VideoProcessing {
  @Prop({ type: Types.ObjectId, ref: 'FileInfo', required: true })
  sourceFileId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(VIDEO_PROCESSING_STATUS), default: VIDEO_PROCESSING_STATUS.PENDING })
  status: VideoProcessingStatus;

  @Prop()
  masterPlaylistUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Chapter' })
  chapterId?: Types.ObjectId;

  /** When set, completed transcode updates this module's videoUrl to the HLS master URL (module-level video without a chapter). */
  @Prop({ type: Types.ObjectId, ref: 'Module' })
  moduleId?: Types.ObjectId;

  @Prop()
  errorMessage?: string;

  @Prop({ default: 0 })
  durationSeconds?: number;
}

export const VideoProcessingSchema = SchemaFactory.createForClass(VideoProcessing);
// Mongoose adds these when timestamps: true
export interface VideoProcessingDoc extends VideoProcessing {
  createdAt?: Date;
  updatedAt?: Date;
}
VideoProcessingSchema.index({ sourceFileId: 1 });
VideoProcessingSchema.index({ chapterId: 1 });
VideoProcessingSchema.index({ moduleId: 1 });
VideoProcessingSchema.index({ status: 1 });
