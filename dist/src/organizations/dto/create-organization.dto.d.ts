export declare class CreateOrganizationDto {
    name: string;
    gstNumber?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    contactPersonName: string;
    contactPersonNumber: string;
    billingDetails?: {
        companyName?: string;
        billingEmail?: string;
        billingAddress?: Record<string, unknown>;
        notes?: string;
    };
}
export declare class AssignSuperAdminDto {
    email: string;
    name: string;
    countryCode: string;
    phoneNumber: string;
}
