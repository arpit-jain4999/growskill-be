import { Model, Types } from 'mongoose';
import { Actor } from '../common/types/actor';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { OrganizationsService } from './organizations.service';
import { PermissionsService } from '../permissions/permissions.service';
export declare class OrgAdminController {
    private userModel;
    private organizationsService;
    private permissionsService;
    constructor(userModel: Model<UserDocument>, organizationsService: OrganizationsService, permissionsService: PermissionsService);
    createUser(body: {
        email?: string;
        name?: string;
        countryCode: string;
        phoneNumber: string;
    }, actor: Actor): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    setUserRole(userId: string, body: {
        role: string;
    }, actor: Actor): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    grantPermission(body: {
        userId: string;
        permissions: string[];
    }, actor: Actor): Promise<{
        userId: string;
        role: "SUPER_ADMIN" | "USER" | "PLATFORM_OWNER" | "ADMIN";
        assignedPermissions: string[];
        effectivePermissions: string[];
    }>;
    enableModule(body: {
        moduleKey: string;
    }, actor: Actor): Promise<{
        enabled: string;
    }>;
    listModules(actor: Actor): Promise<{
        modules: string[];
    }>;
}
