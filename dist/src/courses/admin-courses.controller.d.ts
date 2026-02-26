import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Actor } from '../common/types/actor';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class AdminCoursesController {
    private readonly coursesService;
    private readonly organizationsService;
    constructor(coursesService: CoursesService, organizationsService: OrganizationsService);
    private resolveOrgId;
    findAll(actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findOne(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/course.schema").CourseDocument>;
    create(dto: CreateCourseDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/course.schema").CourseDocument>;
    update(id: string, dto: UpdateCourseDto, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/course.schema").CourseDocument>;
    remove(id: string, actor: Actor, req: {
        headers?: {
            'x-org-id'?: string;
            'X-Org-Id'?: string;
        };
    }): Promise<import("./schemas/course.schema").CourseDocument>;
}
