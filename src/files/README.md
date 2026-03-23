# Files Module

This module handles file uploads with multipart upload support, signed URL generation, and callback notifications.

## Features

- Generate signed URLs for file uploads
- Support multipart uploads
- Callback URL support for upload completion notifications
- File metadata storage
- Backend testing endpoint
- **Video:** automatic HLS transcoding on upload complete; optional **`moduleId`** or **`chapterId`** to attach the finished HLS URL to a module or chapter
- **AWS S3** (optional): presigned PUT from **`POST /v1/files/upload/initiate`**, verification on **`POST /v1/files/upload/complete`**, and server-side upload via **`POST /v1/files/upload/direct`**

## AWS S3 setup

### When S3 is used

S3 is **on** when **`AWS_S3_BUCKET`** or **`FILE_BUCKET_NAME`** is set (non-empty) **and** **`STORAGE_USE_LOCAL`** is **not** `true`.

If those are missing, the API keeps using **local disk** (`LOCAL_UPLOADS_ROOT` + `/uploads/`).

**HLS with S3:** When S3 is on (and **`HLS_UPLOAD_TO_S3`** is not `false`), ffmpeg still writes HLS to a temp directory on the server, then the API **uploads every `.m3u8` and `.ts`** to the same bucket under **`{HLS_S3_KEY_PREFIX}/{videoProcessingId}/`** (default prefix `hls`). **`hlsMasterUrl`** becomes **`FILE_BASE_URL`/`HLS_S3_PUBLIC_BASE_URL` + `/hls/{id}/master.m3u8`** so CloudFront can serve the same distribution as uploads. Local HLS files are removed after upload by default (**`HLS_DELETE_LOCAL_AFTER_S3_UPLOAD`**). When S3 is enabled, **`/uploads/`** is not registered (originals live in the bucket only).

**HLS without S3 (or `HLS_UPLOAD_TO_S3=false`):** HLS stays on disk and is served at **`/hls/...`** on the API; set **`HLS_PUBLIC_BASE_URL`** / **`PUBLIC_APP_URL`** as needed.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_S3_BUCKET` | For S3 | Bucket name (or use `FILE_BUCKET_NAME`) |
| `AWS_REGION` | Recommended | e.g. `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | Usually* | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | Usually* | IAM secret key |
| `FILE_BASE_URL` | Recommended prod | Public base for objects, e.g. **`https://dxxxx.cloudfront.net`** (overrides auto `https://bucket.s3.region.amazonaws.com`) |
| `STORAGE_USE_LOCAL` | Optional | Set to `true` to **force** local disk even if a bucket name is set |
| `S3_PRESIGNED_EXPIRES_SEC` | Optional | Presigned PUT TTL (default `3600`) |
| `AWS_S3_ENDPOINT` | Optional | For **MinIO** / LocalStack, e.g. `http://localhost:9000` |
| `AWS_S3_FORCE_PATH_STYLE` | Optional | Set `true` for MinIO-style endpoints |
| `HLS_UPLOAD_TO_S3` | Optional | Default **on** when S3 is on. Set `false` to keep HLS only on the API disk. |
| `HLS_S3_KEY_PREFIX` | Optional | S3 key prefix for HLS objects (default `hls`). |
| `HLS_S3_PUBLIC_BASE_URL` | Optional | Public base for HLS URLs when uploaded to S3; defaults to same as **`FILE_BASE_URL`** (or S3 virtual host). |
| `HLS_DELETE_LOCAL_AFTER_S3_UPLOAD` | Optional | Default **on**: delete local HLS folder after successful S3 upload. |

\*On **EC2/ECS/Lambda**, you can omit keys and use an **IAM role** with **`s3:PutObject`**, **`s3:GetObject`**, **`s3:HeadObject`** on the bucket/prefix. **`s3:GetObject`** is required for **video transcoding** when the bucket or CloudFront URL is not publicly readable (the worker pulls the source via the SDK, not anonymous HTTP). **HLS upload** needs **`s3:PutObject`** on `hls/*` (or your **`HLS_S3_KEY_PREFIX`**).

### Your responsibilities

1. **Create an S3 bucket** in the chosen region.
2. **IAM policy** (least privilege): allow the app role/user `PutObject`, `GetObject`, `HeadObject` (and `ListBucket` only if you need it) on `arn:aws:s3:::your-bucket/*`.
3. **Public read vs CloudFront:** The **transcoder** downloads the source video via **`imgUrl`** (HTTP GET). Either:
   - Make the **upload prefix** publicly readable (bucket policy), **or**
   - Put **CloudFront** in front of the bucket (**OAC**), set **`FILE_BASE_URL`** to the distribution URL, and keep the bucket private.
4. **HLS playback:** With S3 enabled, objects are at **`hls/{videoProcessingId}/...`** in the bucket. Point **`FILE_BASE_URL`** (CloudFront) at that bucket so **`https://your-cdn/hls/.../master.m3u8`** is publicly readable (bucket policy or CloudFront OAC). For local-only HLS, use **`HLS_PUBLIC_BASE_URL`** for the API origin.

### Client flows with S3

1. **Presigned:** `POST .../upload/initiate` → `PUT` binary to **`signedUrl`** with the **same `Content-Type`** as `mimeType` → `POST .../upload/complete`.
2. **Direct (admin):** `POST .../upload/direct` with **multipart** `file` — the API streams the file to S3 when S3 is enabled.

## Video without a “chapter” screen in admin

The backend already supports **module-level video** (`Module.videoUrl`). If the admin app edits modules but has no chapter UI:

1. On **initiate upload**, send the current module’s id as **`moduleId`** (with `mimeType` like `video/mp4`).
2. On **complete**, the API returns **`hlsMasterUrl`** and **`videoProcessingId`** immediately (playlist URL is stable; segments exist after transcoding finishes).
3. When transcoding completes, the API **updates that module’s `videoUrl`** to the HLS master URL automatically.

Optional: to use **chapters** instead, call **`POST /v1/admin/chapter`** with `moduleId` + `title`, then pass the returned chapter id as **`chapterId`** on upload initiate so **`Chapter.videoUrl`** is set when done.

**S3 + default HLS upload:** **`hlsMasterUrl`** uses **`FILE_BASE_URL`** (same CloudFront as uploads). Ensure the distribution (or bucket policy) allows **GET** on the `hls/` prefix.

**Local HLS only:** set **`HLS_UPLOAD_TO_S3=false`** and set **`HLS_PUBLIC_BASE_URL`** or **`PUBLIC_APP_URL`** to the API origin where **`/hls/...`** is served.

### Local dev: `ENOTFOUND storage.example.com` / transcoding fails

- Empty **`FILE_BASE_URL`** now defaults to **`http://localhost:{PORT}/uploads`** (not `storage.example.com`).
- Use **`POST /v1/files/upload/direct`** (multipart: `folder`, optional `moduleId` / `chapterId`, then **`file`**) so the binary is saved under **`LOCAL_UPLOADS_ROOT`** (default OS temp) and served at **`/uploads/...`**. The HLS worker reads from disk first, then falls back to HTTP/S3.
- Set a real **`FILE_BASE_URL`** (e.g. CloudFront) in production when objects live on S3.

## API Endpoints

### 1. Initiate Upload
**POST** `/files/upload/initiate` (Authenticated)

Initiate a file upload and get a signed URL.

**Request Body:**
```json
{
  "fileName": "cohort-icon.png",
  "mimeType": "image/png",
  "folder": "cohorts/icons/mobile", // Optional: folder path
  "callbackUrl": "https://api.example.com/webhooks/file-uploaded" // Optional: callback URL
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "uuid",
    "fileKey": "cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
    "signedUrl": "https://storage.example.com/upload?key=...",
    "expiresIn": 3600
  }
}
```

### 2. Complete Upload
**POST** `/files/upload/complete` (Public - for storage service callbacks)

Complete the upload and save file metadata. Triggers callback if provided.

**Request Body:**
```json
{
  "uploadId": "uuid",
  "fileKey": "cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
  "fileSize": "12345" // Optional: file size in bytes
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "file-object-id",
    "file": {
      "_id": "file-object-id",
      "name": "cohort-icon.png",
      "key": "cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
      "baseUrl": "https://storage.example.com",
      "imgUrl": "https://storage.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
      "mimeType": "image/png",
      "size": 12345,
      "createdAt": "2024-01-23T12:00:00.000Z",
      "updatedAt": "2024-01-23T12:00:00.000Z"
    }
  }
}
```

**Callback Payload** (sent to callbackUrl if provided):
```json
{
  "success": true,
  "file": {
    "_id": "file-object-id",
    "name": "cohort-icon.png",
    "key": "cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
    "baseUrl": "https://storage.example.com",
    "imgUrl": "https://storage.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
    "mimeType": "image/png",
    "size": 12345,
    "createdAt": "2024-01-23T12:00:00.000Z",
    "updatedAt": "2024-01-23T12:00:00.000Z"
  }
}
```

### 3. Test Upload (Backend Testing)
**POST** `/files/upload/test` (Authenticated)

Test file upload flow from backend. Returns upload details for manual testing.

**Request Body:**
```json
{
  "fileName": "test-file.png",
  "mimeType": "image/png",
  "folder": "test" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "uuid",
    "fileKey": "test/1234567890_abc123_test-file.png",
    "signedUrl": "https://storage.example.com/upload?key=...",
    "message": "Upload initiated. Use the complete endpoint to finish the upload.",
    "completeEndpoint": "/files/upload/complete",
    "completePayload": {
      "uploadId": "uuid",
      "fileKey": "test/1234567890_abc123_test-file.png"
    }
  }
}
```

### 4. Get File
**GET** `/files/:id` (Authenticated)

Get file information by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "file-object-id",
    "name": "cohort-icon.png",
    "key": "cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
    "baseUrl": "https://storage.example.com",
    "imgUrl": "https://storage.example.com/cohorts/icons/mobile/1234567890_abc123_cohort-icon.png",
    "mimeType": "image/png",
    "size": 12345,
    "createdAt": "2024-01-23T12:00:00.000Z",
    "updatedAt": "2024-01-23T12:00:00.000Z"
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
FILE_BASE_URL=https://storage.example.com
FILE_BUCKET_NAME=skillgroww-files
```

## Integration with Storage Services

The current implementation includes placeholder code for signed URL generation. To integrate with actual storage services:

### AWS S3 Integration Example

```typescript
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Generate presigned URL
const signedUrl = s3.getSignedUrl('putObject', {
  Bucket: this.bucketName,
  Key: fileKey,
  ContentType: mimeType,
  Expires: 3600,
});
```

### Google Cloud Storage Integration Example

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: process.env.GCS_KEY_FILE,
  projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(this.bucketName);
const file = bucket.file(fileKey);

const [signedUrl] = await file.getSignedUrl({
  version: 'v4',
  action: 'write',
  expires: Date.now() + 3600 * 1000,
  contentType: mimeType,
});
```

## Usage Flow

### Standard Upload Flow

1. **Client calls** `/files/upload/initiate` with file metadata (optionally with callbackUrl)
2. **Server returns** signed URL, upload ID, and file key
3. **Client uploads** file directly to storage using signed URL
4. **Storage service calls** `/files/upload/complete` with upload ID and file key (or client can call it)
5. **Server saves** file metadata to database
6. **Server triggers callback** (if callbackUrl was provided) with file information

### Backend Testing Flow

1. **Backend calls** `/files/upload/test` with file details
2. **Server returns** upload details including signed URL
3. **Backend can manually upload** file to signed URL or use the complete endpoint
4. **Backend calls** `/files/upload/complete` to finalize upload

## File Structure

Files are organized by folder (optional):
- Default: `uploads/{timestamp}_{uuid}_{filename}`
- Custom: `{folder}/{timestamp}_{uuid}_{filename}`

File naming format: `{timestamp}_{uuid}_{sanitized-filename}`

## Callback Mechanism

When a `callbackUrl` is provided during upload initiation:
- After successful upload completion, the server sends a POST request to the callback URL
- The callback includes the complete file information
- Callback failures are logged but don't fail the upload completion
- Callback timeout: 5 seconds

