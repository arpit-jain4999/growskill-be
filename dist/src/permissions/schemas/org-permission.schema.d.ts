import { Document, Types } from 'mongoose';
export type OrgPermissionDocument = OrgPermission & Document;
export declare class OrgPermission {
    organizationId: Types.ObjectId;
    permissionKey: string;
    grantedAt: Date;
    grantedBy: Types.ObjectId;
}
export declare const OrgPermissionSchema: import("mongoose").Schema<OrgPermission, import("mongoose").Model<OrgPermission, any, any, any, (Document<unknown, any, OrgPermission, any, import("mongoose").DefaultSchemaOptions> & OrgPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, OrgPermission, any, import("mongoose").DefaultSchemaOptions> & OrgPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, OrgPermission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrgPermission, Document<unknown, {}, OrgPermission, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrgPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrgPermission, Document<unknown, {}, OrgPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrgPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permissionKey?: import("mongoose").SchemaDefinitionProperty<string, OrgPermission, Document<unknown, {}, OrgPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrgPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    grantedAt?: import("mongoose").SchemaDefinitionProperty<Date, OrgPermission, Document<unknown, {}, OrgPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrgPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    grantedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrgPermission, Document<unknown, {}, OrgPermission, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrgPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, OrgPermission>;
