import { Document } from 'mongoose';
export type OrganizationDocument = Organization & Document;
export declare class Address {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}
export declare class BillingDetails {
    companyName?: string;
    billingEmail?: string;
    billingAddress?: Record<string, unknown>;
    notes?: string;
}
export declare class Organization {
    name: string;
    gstNumber?: string;
    address?: Address;
    contactPersonName: string;
    contactPersonNumber: string;
    billingDetails?: BillingDetails;
}
export declare const OrganizationSchema: import("mongoose").Schema<Organization, import("mongoose").Model<Organization, any, any, any, (Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Organization>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, Document<unknown, {}, Organization, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    gstNumber?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    address?: import("mongoose").SchemaDefinitionProperty<Address, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    contactPersonName?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    contactPersonNumber?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    billingDetails?: import("mongoose").SchemaDefinitionProperty<BillingDetails, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Organization>;
