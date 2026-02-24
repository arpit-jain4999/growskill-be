import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Actor } from '../common/types/actor';
export declare class AdminChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    findAll(actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findOne(id: string, actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    findByModule(moduleId: string, actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    create(dto: CreateChapterDto, actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    update(id: string, dto: UpdateChapterDto, actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    remove(id: string, actor: Actor): Promise<import("./schemas/chapter.schema").ChapterDocument>;
}
