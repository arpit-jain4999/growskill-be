import { Document, Types } from 'mongoose';
export type OrganizationModuleDocument = OrganizationModule & Document;
export declare class OrganizationModule {
    organizationId: Types.ObjectId;
    moduleKey: string;
    enabled: boolean;
    enabledAt: Date;
    enabledByUserId: Types.ObjectId;
}
export declare const OrganizationModuleSchema: import("mongoose").Schema<OrganizationModule, import("mongoose").Model<OrganizationModule, any, any, any, (Document<unknown, any, OrganizationModule, any, import("mongoose").DefaultSchemaOptions> & OrganizationModule & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, OrganizationModule, any, import("mongoose").DefaultSchemaOptions> & OrganizationModule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, OrganizationModule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrganizationModule, Document<unknown, {}, OrganizationModule, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrganizationModule, Document<unknown, {}, OrganizationModule, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    moduleKey?: import("mongoose").SchemaDefinitionProperty<string, OrganizationModule, Document<unknown, {}, OrganizationModule, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enabled?: import("mongoose").SchemaDefinitionProperty<boolean, OrganizationModule, Document<unknown, {}, OrganizationModule, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enabledAt?: import("mongoose").SchemaDefinitionProperty<Date, OrganizationModule, Document<unknown, {}, OrganizationModule, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enabledByUserId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrganizationModule, Document<unknown, {}, OrganizationModule, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<OrganizationModule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, OrganizationModule>;
