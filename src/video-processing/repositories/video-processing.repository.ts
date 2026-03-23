import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VideoProcessing, VideoProcessingDocument, VideoProcessingStatus } from '../schemas/video-processing.schema';

@Injectable()
export class VideoProcessingRepository {
  constructor(
    @InjectModel(VideoProcessing.name) private model: Model<VideoProcessingDocument>,
  ) {}

  async create(data: Partial<VideoProcessing>): Promise<VideoProcessingDocument> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<VideoProcessingDocument | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return this.model.findById(id);
  }

  async updateStatus(
    id: string,
    status: VideoProcessingStatus,
    data?: Partial<Pick<VideoProcessing, 'masterPlaylistUrl' | 'errorMessage' | 'durationSeconds'>>,
  ): Promise<VideoProcessingDocument | null> {
    const update: Record<string, unknown> = { status };
    if (data?.masterPlaylistUrl != null) update.masterPlaylistUrl = data.masterPlaylistUrl;
    if (data?.errorMessage != null) update.errorMessage = data.errorMessage;
    if (data?.durationSeconds != null) update.durationSeconds = data.durationSeconds;
    return this.model
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();
  }
}
