import { ConfigService } from '@nestjs/config';
import { VideoProcessingRepository } from './repositories/video-processing.repository';
import { FileRepository } from '../files/repositories/file.repository';
import { ChapterRepository } from '../chapters/repositories/chapter.repository';
import { ModuleRepository } from '../modules/repositories/module.repository';
import { LoggerService } from '../common/services/logger.service';
export declare class VideoProcessingService {
    private readonly videoProcessingRepo;
    private readonly fileRepository;
    private readonly chapterRepository;
    private readonly moduleRepository;
    private readonly configService;
    private readonly logger;
    constructor(videoProcessingRepo: VideoProcessingRepository, fileRepository: FileRepository, chapterRepository: ChapterRepository, moduleRepository: ModuleRepository, configService: ConfigService, logger: LoggerService);
    startTranscode(params: {
        sourceFileId: string;
        chapterId?: string;
        moduleId?: string;
    }): Promise<{
        videoProcessingId: string;
        hlsMasterUrl: string;
    }>;
    getPublicMasterPlaylistUrl(videoProcessingId: string): string;
    private runTranscode;
    private getOutputDir;
    private resolveMasterPlaylistUrl;
    private resolveSourceVideoToTemp;
    private downloadFile;
    private runFfmpegHls;
    getStatus(videoProcessingId: string): Promise<{
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
