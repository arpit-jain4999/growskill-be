"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireTenantGuard = exports.TenantContextGuard = exports.DEFAULT_X_ORG_ID = exports.TENANT_RESOLVER = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../decorators/public.decorator");
exports.TENANT_RESOLVER = 'TENANT_RESOLVER';
exports.DEFAULT_X_ORG_ID = '698b0f6076ca77d98d706e65';
let TenantContextGuard = class TenantContextGuard {
    constructor(reflector, tenantResolver) {
        this.reflector = reflector;
        this.tenantResolver = tenantResolver;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        let organizationId = user.organizationId ?? null;
        if (!organizationId &&
            user.role === 'PLATFORM_OWNER' &&
            this.tenantResolver) {
            const headerValue = request.headers?.['x-org-id'] ?? request.headers?.['X-Org-Id'];
            const effectiveOrgId = headerValue?.trim() || exports.DEFAULT_X_ORG_ID;
            organizationId = await this.tenantResolver.resolveOrgId(effectiveOrgId);
        }
        const actor = {
            userId: user.userId ?? user.sub,
            organizationId,
            role: user.role ?? 'USER',
            permissions: user.permissions ?? [],
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
        };
        request.actor = actor;
        return true;
    }
};
exports.TenantContextGuard = TenantContextGuard;
exports.TenantContextGuard = TenantContextGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(exports.TENANT_RESOLVER)),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], TenantContextGuard);
let RequireTenantGuard = class RequireTenantGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const actor = request.actor;
        if (!actor?.organizationId) {
            throw new common_1.ForbiddenException('Tenant context required for this action');
        }
        return true;
    }
};
exports.RequireTenantGuard = RequireTenantGuard;
exports.RequireTenantGuard = RequireTenantGuard = __decorate([
    (0, common_1.Injectable)()
], RequireTenantGuard);
//# sourceMappingURL=tenant-context.guard.js.map