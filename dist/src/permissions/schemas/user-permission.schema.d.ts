import { Document, Types } from 'mongoose';
export type UserPermissionDocument = UserPermission & Document;
export declare class UserPermission {
    organizationId: Types.ObjectId;
    userId: Types.ObjectId;
    permissionKey: string;
    grantedAt: Date;
    grantedBy: Types.ObjectId;
}
export declare const UserPermissionSchema: import("mongoose").Schema<UserPermission, import("mongoose").Model<UserPermission, any, any, any, (Document<unknown, any, UserPermission, any, import("mongoose").DefaultSchemaOptions> & UserPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, UserPermission, any, import("mongoose").DefaultSchemaOptions> & UserPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, UserPermission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserPermission, Document<unknown, {}, UserPermission, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, UserPermission, Document<unknown, {}, UserPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, UserPermission, Document<unknown, {}, UserPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permissionKey?: import("mongoose").SchemaDefinitionProperty<string, UserPermission, Document<unknown, {}, UserPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    grantedAt?: import("mongoose").SchemaDefinitionProperty<Date, UserPermission, Document<unknown, {}, UserPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    grantedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, UserPermission, Document<unknown, {}, UserPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<UserPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, UserPermission>;
