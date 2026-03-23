import { VideoProcessingService } from './video-processing.service';
export declare class VideoProcessingController {
    private readonly videoProcessingService;
    constructor(videoProcessingService: VideoProcessingService);
    getProcessingStatus(id: string): Promise<{
        videoProcessingId: string;
        status: import("./schemas/video-processing.schema").VideoProcessingStatus;
        masterPlaylistUrl: string;
        chapterId: string;
        moduleId: string;
        errorMessage: string;
        durationSeconds: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
