"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const org_permission_schema_1 = require("./schemas/org-permission.schema");
const user_permission_schema_1 = require("./schemas/user-permission.schema");
const org_permission_repository_1 = require("./repositories/org-permission.repository");
const user_permission_repository_1 = require("./repositories/user-permission.repository");
const permissions_service_1 = require("./permissions.service");
const admin_permissions_controller_1 = require("./admin-permissions.controller");
const user_schema_1 = require("../auth/schemas/user.schema");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const common_module_1 = require("../common/common.module");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            mongoose_1.MongooseModule.forFeature([
                { name: org_permission_schema_1.OrgPermission.name, schema: org_permission_schema_1.OrgPermissionSchema },
                { name: user_permission_schema_1.UserPermission.name, schema: user_permission_schema_1.UserPermissionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [admin_permissions_controller_1.AdminPermissionsController],
        providers: [
            org_permission_repository_1.OrgPermissionRepository,
            user_permission_repository_1.UserPermissionRepository,
            permissions_service_1.PermissionsService,
            { provide: authorize_guard_1.PERMISSIONS_SERVICE, useExisting: permissions_service_1.PermissionsService },
        ],
        exports: [
            permissions_service_1.PermissionsService,
            authorize_guard_1.PERMISSIONS_SERVICE,
            org_permission_repository_1.OrgPermissionRepository,
            user_permission_repository_1.UserPermissionRepository,
        ],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map