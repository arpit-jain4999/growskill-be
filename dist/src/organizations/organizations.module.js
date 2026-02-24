"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const organization_schema_1 = require("./schemas/organization.schema");
const organization_module_schema_1 = require("./schemas/organization-module.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const organization_repository_1 = require("./repositories/organization.repository");
const organization_module_repository_1 = require("./repositories/organization-module.repository");
const organizations_service_1 = require("./organizations.service");
const tenant_resolution_service_1 = require("./tenant-resolution.service");
const platform_controller_1 = require("./platform.controller");
const org_admin_controller_1 = require("./org-admin.controller");
const authorize_guard_1 = require("../common/guards/authorize.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const common_module_1 = require("../common/common.module");
const permissions_module_1 = require("../permissions/permissions.module");
let OrganizationsModule = class OrganizationsModule {
};
exports.OrganizationsModule = OrganizationsModule;
exports.OrganizationsModule = OrganizationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            permissions_module_1.PermissionsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema },
                { name: organization_module_schema_1.OrganizationModule.name, schema: organization_module_schema_1.OrganizationModuleSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [platform_controller_1.PlatformController, org_admin_controller_1.OrgAdminController],
        providers: [
            organization_repository_1.OrganizationRepository,
            organization_module_repository_1.OrganizationModuleRepository,
            organizations_service_1.OrganizationsService,
            tenant_resolution_service_1.TenantResolutionService,
            { provide: tenant_context_guard_1.TENANT_RESOLVER, useExisting: tenant_resolution_service_1.TenantResolutionService },
            tenant_context_guard_1.TenantContextGuard,
            authorize_guard_1.AuthorizeGuard,
        ],
        exports: [
            organizations_service_1.OrganizationsService,
            organization_repository_1.OrganizationRepository,
            organization_module_repository_1.OrganizationModuleRepository,
            tenant_context_guard_1.TenantContextGuard,
        ],
    })
], OrganizationsModule);
//# sourceMappingURL=organizations.module.js.map