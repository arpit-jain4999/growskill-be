import { ChapterRepository } from './repositories/chapter.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChaptersService {
    private chapterRepository;
    private logger;
    constructor(chapterRepository: ChapterRepository, logger: LoggerService);
    findAll(): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findAllForAdmin(organizationId: string): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findById(id: string): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    findByIdForAdmin(id: string, organizationId: string): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    findByModuleId(moduleId: string): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findByModuleIdForAdmin(moduleId: string, organizationId: string): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    create(organizationId: string, dto: CreateChapterDto): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    update(id: string, organizationId: string, dto: UpdateChapterDto): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    remove(id: string, organizationId: string): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    removeByModuleId(moduleId: string, organizationId: string): Promise<number>;
}
