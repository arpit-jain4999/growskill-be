"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowPlatformOwnerWithoutTenant = exports.ALLOW_PLATFORM_OWNER_WITHOUT_TENANT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ALLOW_PLATFORM_OWNER_WITHOUT_TENANT_KEY = 'allowPlatformOwnerWithoutTenant';
const AllowPlatformOwnerWithoutTenant = () => (0, common_1.SetMetadata)(exports.ALLOW_PLATFORM_OWNER_WITHOUT_TENANT_KEY, true);
exports.AllowPlatformOwnerWithoutTenant = AllowPlatformOwnerWithoutTenant;
//# sourceMappingURL=allow-platform-owner-without-tenant.decorator.js.map