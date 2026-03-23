"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePublicFileStorageBaseUrl = resolvePublicFileStorageBaseUrl;
const url_normalize_1 = require("./url-normalize");
function resolvePublicFileStorageBaseUrl(get, s3Enabled, s3Bucket) {
    const fb = String(get('FILE_BASE_URL') ?? '').trim();
    if (fb && !/storage\.example\.com/i.test(fb)) {
        return (0, url_normalize_1.normalizePublicBaseUrl)(fb);
    }
    if (s3Enabled && s3Bucket) {
        const region = String(get('AWS_REGION') || 'us-east-1').trim();
        return `https://${s3Bucket}.s3.${region}.amazonaws.com`;
    }
    const port = Number(get('PORT')) || 3000;
    return `http://localhost:${port}/uploads`;
}
//# sourceMappingURL=storage-public-base-url.js.map