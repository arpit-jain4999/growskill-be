import { Document, Types } from 'mongoose';
import { FileInfo } from '../../common/schemas/file.schema';
export type CohortDocument = Cohort & Document;
export declare class Cohort {
    organizationId: Types.ObjectId;
    name: string;
    icon?: {
        mobile?: FileInfo;
        web?: FileInfo;
    };
    displayOrder: number;
    countryCode: string;
    isVisibleOnHomePage: boolean;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
}
export declare const CohortSchema: import("mongoose").Schema<Cohort, import("mongoose").Model<Cohort, any, any, any, (Document<unknown, any, Cohort, any, import("mongoose").DefaultSchemaOptions> & Cohort & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Cohort, any, import("mongoose").DefaultSchemaOptions> & Cohort & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Cohort>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cohort, Document<unknown, {}, Cohort, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    name?: import("mongoose").SchemaDefinitionProperty<string, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    icon?: import("mongoose").SchemaDefinitionProperty<{
        mobile?: FileInfo;
        web?: FileInfo;
    }, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    displayOrder?: import("mongoose").SchemaDefinitionProperty<number, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    countryCode?: import("mongoose").SchemaDefinitionProperty<string, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isVisibleOnHomePage?: import("mongoose").SchemaDefinitionProperty<boolean, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Cohort, Document<unknown, {}, Cohort, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Cohort & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Cohort>;
