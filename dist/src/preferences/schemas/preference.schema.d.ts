import { Document } from 'mongoose';
export type PreferenceDocument = Preference & Document;
export declare class Preference {
    key: string;
    value: string;
    description?: string;
    isActive: boolean;
}
export declare const PreferenceSchema: import("mongoose").Schema<Preference, import("mongoose").Model<Preference, any, any, any, (Document<unknown, any, Preference, any, import("mongoose").DefaultSchemaOptions> & Preference & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Preference, any, import("mongoose").DefaultSchemaOptions> & Preference & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Preference>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Preference, Document<unknown, {}, Preference, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Preference & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    key?: import("mongoose").SchemaDefinitionProperty<string, Preference, Document<unknown, {}, Preference, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Preference & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    value?: import("mongoose").SchemaDefinitionProperty<string, Preference, Document<unknown, {}, Preference, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Preference & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Preference, Document<unknown, {}, Preference, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Preference & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Preference, Document<unknown, {}, Preference, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Preference & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Preference>;
