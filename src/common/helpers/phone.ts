/**
 * Normalize country code and phone number for consistent storage and lookup.
 * Use everywhere we store or query by phone so "91", "+91", " 91 " and "8318204215", " 8318204215 " match the same user/OTP.
 */

/** e.g. "+91" and " 91 " → "91" */
export function normalizeCountryCode(code: string): string {
  return (code || '').replace(/^\+/, '').trim() || (code || '');
}

/** Trim and collapse spaces */
export function normalizePhoneNumber(phone: string): string {
  return (phone || '').trim().replace(/\s+/g, ' ');
}

/** Country code variants for DB query: match both "91" and "+91" when normalized is "91" */
export function countryCodeQueryVariants(normalizedCountry: string): string[] {
  const withoutPlus = normalizeCountryCode(normalizedCountry);
  const withPlus = withoutPlus ? `+${withoutPlus}` : '';
  return withPlus ? [withoutPlus, withPlus] : [withoutPlus];
}
