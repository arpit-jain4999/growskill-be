import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type CourseDocument = Course & Document;
export declare class Course {
    organizationId: Types.ObjectId;
    title: string;
    description?: string;
    instructorId: Types.ObjectId;
    fee: {
        amount: number;
        discount: number;
    };
    cohortId?: Types.ObjectId;
    isPublished: boolean;
    enrollmentCount: number;
    thumbnail?: string;
    category?: string;
    rating: number;
    totalRatings: number;
    price?: number;
}
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, (Document<unknown, any, Course, any, import("mongoose").DefaultSchemaOptions> & Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Course, any, import("mongoose").DefaultSchemaOptions> & Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Course>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, Course, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    title?: import("mongoose").SchemaDefinitionProperty<string, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    instructorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fee?: import("mongoose").SchemaDefinitionProperty<{
        amount: number;
        discount: number;
    }, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    cohortId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enrollmentCount?: import("mongoose").SchemaDefinitionProperty<number, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    thumbnail?: import("mongoose").SchemaDefinitionProperty<string, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    category?: import("mongoose").SchemaDefinitionProperty<string, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    rating?: import("mongoose").SchemaDefinitionProperty<number, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    totalRatings?: import("mongoose").SchemaDefinitionProperty<number, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    price?: import("mongoose").SchemaDefinitionProperty<number, Course, Document<unknown, {}, Course, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Course & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Course>;
