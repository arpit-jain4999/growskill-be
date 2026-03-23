import * as os from 'os';
import * as path from 'path';

/**
 * Defaults for local video uploads and HLS output live under the OS temp dir
 * (`/var/folders/.../growskill-be/...` on macOS) instead of `./storage/...`.
 *
 * That way `nest start --watch` (TypeScript watch) and other repo-wide file
 * watchers are less likely to restart the app when uploads/transcoding write
 * many files — which would wipe in-memory state (e.g. upload sessions).
 *
 * Override with LOCAL_UPLOADS_ROOT / VIDEO_HLS_OUTPUT_DIR if you want paths
 * inside the project (e.g. Docker volume at ./storage).
 */
export function defaultLocalUploadsRoot(): string {
  return path.join(os.tmpdir(), 'growskill-be', 'uploads');
}

export function defaultHlsOutputRoot(): string {
  return path.join(os.tmpdir(), 'growskill-be', 'hls');
}

export function resolveLocalUploadsRoot(configured: string | undefined): string {
  const t = (configured ?? '').trim();
  return t.length > 0 ? t : defaultLocalUploadsRoot();
}

export function resolveHlsOutputRoot(configured: string | undefined): string {
  const t = (configured ?? '').trim();
  return t.length > 0 ? t : defaultHlsOutputRoot();
}
