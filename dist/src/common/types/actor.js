"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.isInOrg = isInOrg;
function hasPermission(actor, permission) {
    if (actor.role === 'PLATFORM_OWNER')
        return true;
    return actor.permissions.includes(permission);
}
function isInOrg(actor) {
    return actor.organizationId != null && actor.organizationId !== '';
}
//# sourceMappingURL=actor.js.map