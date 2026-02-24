import { CoursesService } from './courses.service';
import { FindAllCoursesQueryDto } from './dto/find-all-courses-query.dto';
import { Actor } from '../common/types/actor';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(query: FindAllCoursesQueryDto, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findMyCourses(actor: Actor): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findOne(id: string, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument>;
}
