import { Document } from 'mongoose';
export type FileInfoDocument = FileInfo & Document;
export declare class FileInfo {
    name: string;
    key: string;
    baseUrl: string;
    imgUrl: string;
    mimeType?: string;
    size?: number;
}
export declare const FileInfoSchema: import("mongoose").Schema<FileInfo, import("mongoose").Model<FileInfo, any, any, any, (Document<unknown, any, FileInfo, any, import("mongoose").DefaultSchemaOptions> & FileInfo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, FileInfo, any, import("mongoose").DefaultSchemaOptions> & FileInfo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, FileInfo>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FileInfo, Document<unknown, {}, FileInfo, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    key?: import("mongoose").SchemaDefinitionProperty<string, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    baseUrl?: import("mongoose").SchemaDefinitionProperty<string, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    imgUrl?: import("mongoose").SchemaDefinitionProperty<string, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mimeType?: import("mongoose").SchemaDefinitionProperty<string, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    size?: import("mongoose").SchemaDefinitionProperty<number, FileInfo, Document<unknown, {}, FileInfo, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<FileInfo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, FileInfo>;
