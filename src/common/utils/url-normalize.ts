/**
 * Many env mistakes: CloudFront or S3 URL without scheme (e.g. dxxx.cloudfront.net).
 * Node http(s).client and new URL() need a proper absolute URL.
 */
export function normalizePublicBaseUrl(raw: string): string {
  const t = raw.trim().replace(/\/+$/, '');
  if (!t) return '';
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

/**
 * Full object URL (base + key) or any download URL — adds https/http if scheme missing.
 */
export function ensureAbsoluteHttpUrl(raw: string): string {
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
