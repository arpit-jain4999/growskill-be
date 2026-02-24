import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';
export declare class ChapterRepository {
    private chapterModel;
    constructor(chapterModel: Model<ChapterDocument>);
    findAll(): Promise<ChapterDocument[]>;
    findAllForAdmin(organizationId: string): Promise<ChapterDocument[]>;
    findById(id: string, organizationId?: string): Promise<ChapterDocument | null>;
    findByModuleId(moduleId: string): Promise<ChapterDocument[]>;
    findByModuleIdForAdmin(moduleId: string, organizationId: string): Promise<ChapterDocument[]>;
    create(data: Partial<Chapter>): Promise<ChapterDocument>;
    update(id: string, organizationId: string, data: Partial<Chapter>): Promise<ChapterDocument | null>;
    delete(id: string, organizationId: string): Promise<ChapterDocument | null>;
    deleteByModuleId(moduleId: string, organizationId: string): Promise<number>;
}
