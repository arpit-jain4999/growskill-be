import { CourseRepository } from './repositories/course.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private courseRepository;
    private logger;
    constructor(courseRepository: CourseRepository, logger: LoggerService);
    findAll(filter: {
        organizationId: string;
        name?: string;
        cohortId?: string;
    }): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findAllForAdmin(organizationId: string): Promise<import("./schemas/course.schema").CourseDocument[]>;
    findById(id: string, organizationId: string): Promise<import("./schemas/course.schema").CourseDocument>;
    findMyCourses(userId: string, organizationId: string): Promise<import("./schemas/course.schema").CourseDocument[]>;
    create(organizationId: string, instructorId: string, dto: CreateCourseDto): Promise<import("./schemas/course.schema").CourseDocument>;
    update(id: string, organizationId: string, dto: UpdateCourseDto): Promise<import("./schemas/course.schema").CourseDocument>;
    remove(id: string, organizationId: string): Promise<import("./schemas/course.schema").CourseDocument>;
}
