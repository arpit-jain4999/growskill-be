export type StorageConfigGetter = (key: string) => string | number | undefined;
export declare function resolvePublicFileStorageBaseUrl(get: StorageConfigGetter, s3Enabled: boolean, s3Bucket: string): string;
