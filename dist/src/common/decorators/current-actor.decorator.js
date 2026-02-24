"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentActor = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentActor = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const actor = request.actor;
    if (!actor) {
        throw new Error('Actor not set; ensure JwtAuthGuard and tenant context run first');
    }
    return actor;
});
//# sourceMappingURL=current-actor.decorator.js.map