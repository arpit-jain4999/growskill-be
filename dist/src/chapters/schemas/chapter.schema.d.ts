import { Document, Types } from 'mongoose';
export type ChapterDocument = Chapter & Document;
export declare class Chapter {
    organizationId: Types.ObjectId;
    moduleId: Types.ObjectId;
    title: string;
    description?: string;
    order: number;
    isActive: boolean;
    content?: string;
    videoUrl?: string;
    pdfUrl?: string;
    thumbnail?: string;
    duration: number;
    contentType: string;
}
export declare const ChapterSchema: import("mongoose").Schema<Chapter, import("mongoose").Model<Chapter, any, any, any, (Document<unknown, any, Chapter, any, import("mongoose").DefaultSchemaOptions> & Chapter & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Chapter, any, import("mongoose").DefaultSchemaOptions> & Chapter & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Chapter>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chapter, Document<unknown, {}, Chapter, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    moduleId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    title?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    order?: import("mongoose").SchemaDefinitionProperty<number, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    content?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    videoUrl?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pdfUrl?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    thumbnail?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    duration?: import("mongoose").SchemaDefinitionProperty<number, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    contentType?: import("mongoose").SchemaDefinitionProperty<string, Chapter, Document<unknown, {}, Chapter, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Chapter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Chapter>;
