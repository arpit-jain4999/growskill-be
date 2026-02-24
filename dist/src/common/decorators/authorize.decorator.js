"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorize = exports.AUTHORIZE_PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUTHORIZE_PERMISSION_KEY = 'authorize:permission';
const Authorize = (permission) => (0, common_1.SetMetadata)(exports.AUTHORIZE_PERMISSION_KEY, permission);
exports.Authorize = Authorize;
//# sourceMappingURL=authorize.decorator.js.map