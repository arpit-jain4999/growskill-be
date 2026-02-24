import { ChaptersService } from './chapters.service';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    findAll(): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findOne(id: string): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    findByModule(moduleId: string): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
}
