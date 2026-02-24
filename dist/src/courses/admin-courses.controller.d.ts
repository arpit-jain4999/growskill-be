import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Actor } from '../common/types/actor';
export declare class AdminCoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(actor: Actor): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findOne(id: string, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument>;
    create(dto: CreateCourseDto, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument>;
    update(id: string, dto: UpdateCourseDto, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument>;
    remove(id: string, actor: Actor): Promise<import("./schemas/course.schema").CourseDocument>;
}
