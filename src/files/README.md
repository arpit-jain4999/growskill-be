# Files Module

This module handles file uploads with multipart upload support, signed URL generation, and callback notifications.

## Features

- Generate signed URLs for file uploads
- Support multipart uploads
- Callback URL support for upload completion notifications
- File metadata storage
- Backend testing endpoint

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

