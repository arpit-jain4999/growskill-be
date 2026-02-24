import { Document, Types } from 'mongoose';
export type ModuleDocument = Module & Document;
export declare class Module {
    organizationId: Types.ObjectId;
    title: string;
    description?: string;
    courseId?: Types.ObjectId;
    order: number;
    isActive: boolean;
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, (Document<unknown, any, Module, any, import("mongoose").DefaultSchemaOptions> & Module & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Module, any, import("mongoose").DefaultSchemaOptions> & Module & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Module>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, Module, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    title?: import("mongoose").SchemaDefinitionProperty<string, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    courseId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    order?: import("mongoose").SchemaDefinitionProperty<number, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Module, Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Module & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Module>;
