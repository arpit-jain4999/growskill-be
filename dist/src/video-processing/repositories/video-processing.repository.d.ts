import { Model } from 'mongoose';
import { VideoProcessing, VideoProcessingDocument, VideoProcessingStatus } from '../schemas/video-processing.schema';
export declare class VideoProcessingRepository {
    private model;
    constructor(model: Model<VideoProcessingDocument>);
    create(data: Partial<VideoProcessing>): Promise<VideoProcessingDocument>;
    findById(id: string): Promise<VideoProcessingDocument | null>;
    updateStatus(id: string, status: VideoProcessingStatus, data?: Partial<Pick<VideoProcessing, 'masterPlaylistUrl' | 'errorMessage' | 'durationSeconds'>>): Promise<VideoProcessingDocument | null>;
}
