import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Actor } from '../common/types/actor';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class AdminChaptersController {
    private readonly chaptersService;
    private readonly organizationsService;
    constructor(chaptersService: ChaptersService, organizationsService: OrganizationsService);
    private resolveOrgId;
    findAll(actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    findOne(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    findByModule(moduleId: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument[]>;
    create(dto: CreateChapterDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    update(id: string, dto: UpdateChapterDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument>;
    remove(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/chapter.schema").ChapterDocument>;
}
