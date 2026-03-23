"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePublicBaseUrl = normalizePublicBaseUrl;
exports.ensureAbsoluteHttpUrl = ensureAbsoluteHttpUrl;
function normalizePublicBaseUrl(raw) {
    const t = raw.trim().replace(/\/+$/, '');
    if (!t)
        return '';
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(t)) {
        return t;
    }
    if (t.startsWith('/')) {
        return t;
    }
    const host0 = t.split('/')[0].split(':')[0];
    const scheme = /^localhost$/i.test(host0) ? 'http' : 'https';
    return `${scheme}://${t}`.replace(/\/+$/, '');
}
function ensureAbsoluteHttpUrl(raw) {
    const s = raw.trim();
    if (!s) {
        return s;
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(s)) {
        return new URL(s).href;
    }
    if (s.startsWith('/')) {
        return s;
    }
    const host0 = s.split('/')[0].split(':')[0];
    const scheme = /^localhost$/i.test(host0) ? 'http' : 'https';
    return new URL(`${scheme}://${s}`).href;
}
//# sourceMappingURL=url-normalize.js.map