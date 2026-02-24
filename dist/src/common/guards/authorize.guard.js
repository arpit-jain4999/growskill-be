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
exports.AuthorizeGuard = exports.PERMISSIONS_SERVICE = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_1 = require("../constants/roles");
const authorize_decorator_1 = require("../decorators/authorize.decorator");
exports.PERMISSIONS_SERVICE = 'PERMISSIONS_SERVICE';
let AuthorizeGuard = class AuthorizeGuard {
    constructor(reflector, permissionsService) {
        this.reflector = reflector;
        this.permissionsService = permissionsService;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.getAllAndOverride(authorize_decorator_1.AUTHORIZE_PERMISSION_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const actor = request.actor;
        if (!actor) {
            throw new common_1.ForbiddenException('Unauthorized');
        }
        if (actor.role === roles_1.ROLES.PLATFORM_OWNER) {
            return true;
        }
        const hasIt = this.permissionsService
            ? await this.permissionsService.hasPermission(actor, requiredPermission)
            : (actor.permissions ?? []).includes(requiredPermission);
        if (!hasIt) {
            throw new common_1.ForbiddenException(`Missing required permission: ${requiredPermission}`);
        }
        return true;
    }
};
exports.AuthorizeGuard = AuthorizeGuard;
exports.AuthorizeGuard = AuthorizeGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(exports.PERMISSIONS_SERVICE)),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], AuthorizeGuard);
//# sourceMappingURL=authorize.guard.js.map