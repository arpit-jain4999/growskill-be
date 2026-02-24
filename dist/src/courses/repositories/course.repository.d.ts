import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
export interface FindAllCoursesFilter {
    organizationId: string;
    name?: string;
    cohortId?: string;
}
export declare class CourseRepository {
    private courseModel;
    constructor(courseModel: Model<CourseDocument>);
    findAll(filter: FindAllCoursesFilter): Promise<CourseDocument[]>;
    findAllForAdmin(organizationId: string): Promise<CourseDocument[]>;
    findById(id: string, organizationId?: string): Promise<CourseDocument | null>;
    findByUserId(userId: string, organizationId: string): Promise<CourseDocument[]>;
    create(data: Partial<Course>): Promise<CourseDocument>;
    update(id: string, organizationId: string, data: Partial<Course>): Promise<CourseDocument | null>;
    delete(id: string, organizationId: string): Promise<CourseDocument | null>;
}
