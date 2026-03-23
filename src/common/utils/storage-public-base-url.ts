import { normalizePublicBaseUrl } from './url-normalize';

/** Minimal config getter for use outside injectable services. */
export type StorageConfigGetter = (key: string) => string | number | undefined;

/**
 * Public base URL for objects in the primary storage (S3 or local /uploads).
 * Matches previous FilesService.resolvePublicFileBaseUrl behavior.
 */
export function resolvePublicFileStorageBaseUrl(
  get: StorageConfigGetter,
  s3Enabled: boolean,
  s3Bucket: string,
): string {
  const fb = String(get('FILE_BASE_URL') ?? '').trim();
  if (fb && !/storage\.example\.com/i.test(fb)) {
    return normalizePublicBaseUrl(fb);
  }
  if (s3Enabled && s3Bucket) {
    const region = String(get('AWS_REGION') || 'us-east-1').trim();
    return `https://${s3Bucket}.s3.${region}.amazonaws.com`;
  }
  const port = Number(get('PORT')) || 3000;
  return `http://localhost:${port}/uploads`;
}
