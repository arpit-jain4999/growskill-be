"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCountryCode = normalizeCountryCode;
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.countryCodeQueryVariants = countryCodeQueryVariants;
function normalizeCountryCode(code) {
    return (code || '').replace(/^\+/, '').trim() || (code || '');
}
function normalizePhoneNumber(phone) {
    return (phone || '').trim().replace(/\s+/g, ' ');
}
function countryCodeQueryVariants(normalizedCountry) {
    const withoutPlus = normalizeCountryCode(normalizedCountry);
    const withPlus = withoutPlus ? `+${withoutPlus}` : '';
    return withPlus ? [withoutPlus, withPlus] : [withoutPlus];
}
//# sourceMappingURL=phone.js.map