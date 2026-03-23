"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLocalUploadsRoot = defaultLocalUploadsRoot;
exports.defaultHlsOutputRoot = defaultHlsOutputRoot;
exports.resolveLocalUploadsRoot = resolveLocalUploadsRoot;
exports.resolveHlsOutputRoot = resolveHlsOutputRoot;
const os = require("os");
const path = require("path");
function defaultLocalUploadsRoot() {
    return path.join(os.tmpdir(), 'growskill-be', 'uploads');
}
function defaultHlsOutputRoot() {
    return path.join(os.tmpdir(), 'growskill-be', 'hls');
}
function resolveLocalUploadsRoot(configured) {
    const t = (configured ?? '').trim();
    return t.length > 0 ? t : defaultLocalUploadsRoot();
}
function resolveHlsOutputRoot(configured) {
    const t = (configured ?? '').trim();
    return t.length > 0 ? t : defaultHlsOutputRoot();
}
//# sourceMappingURL=local-media-paths.js.map