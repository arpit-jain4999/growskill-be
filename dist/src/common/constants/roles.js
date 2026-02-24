"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORG_ROLES = exports.ROLES = void 0;
exports.isPlatformOwner = isPlatformOwner;
exports.isSuperAdmin = isSuperAdmin;
exports.isOrgRole = isOrgRole;
exports.ROLES = {
    PLATFORM_OWNER: 'PLATFORM_OWNER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    USER: 'USER',
};
exports.ORG_ROLES = [
    exports.ROLES.SUPER_ADMIN,
    exports.ROLES.ADMIN,
    exports.ROLES.USER,
];
function isPlatformOwner(role) {
    return role === exports.ROLES.PLATFORM_OWNER;
}
function isSuperAdmin(role) {
    return role === exports.ROLES.SUPER_ADMIN;
}
function isOrgRole(role) {
    return exports.ORG_ROLES.includes(role);
}
//# sourceMappingURL=roles.js.map