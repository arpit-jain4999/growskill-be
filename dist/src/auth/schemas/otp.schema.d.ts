import { Document } from 'mongoose';
export type OtpDocument = Otp & Document;
export declare class Otp {
    countryCode: string;
    phoneNumber: string;
    code: string;
    expiresAt: Date;
    isUsed: boolean;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, (Document<unknown, any, Otp, any, import("mongoose").DefaultSchemaOptions> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Otp, any, import("mongoose").DefaultSchemaOptions> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Otp>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, Otp, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    countryCode?: import("mongoose").SchemaDefinitionProperty<string, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    phoneNumber?: import("mongoose").SchemaDefinitionProperty<string, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    code?: import("mongoose").SchemaDefinitionProperty<string, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isUsed?: import("mongoose").SchemaDefinitionProperty<boolean, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Otp & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Otp>;
