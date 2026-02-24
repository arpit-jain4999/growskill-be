import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';
export declare class ModuleRepository {
    private moduleModel;
    constructor(moduleModel: Model<ModuleDocument>);
    findAll(): Promise<ModuleDocument[]>;
    findAllForAdmin(organizationId: string): Promise<ModuleDocument[]>;
    findById(id: string, organizationId?: string): Promise<ModuleDocument | null>;
    findByCourseId(courseId: string): Promise<ModuleDocument[]>;
    create(data: Partial<Module>): Promise<ModuleDocument>;
    update(id: string, organizationId: string, data: Partial<Module>): Promise<ModuleDocument | null>;
    delete(id: string, organizationId: string): Promise<ModuleDocument | null>;
}
