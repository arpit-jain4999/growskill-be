"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSameOrg = assertSameOrg;
const common_1 = require("@nestjs/common");
function assertSameOrg(resourceOrgId, actorOrgId) {
    if (actorOrgId == null || actorOrgId === '') {
        throw new common_1.ForbiddenException('Tenant context required');
    }
    const resource = resourceOrgId?.toString?.() ?? resourceOrgId;
    const actor = actorOrgId?.toString?.() ?? actorOrgId;
    if (resource !== actor) {
        throw new common_1.ForbiddenException('Access denied: resource belongs to another organization');
    }
}
//# sourceMappingURL=assert-same-org.js.map