# Swagger API Documentation

## Access Swagger UI

Once the application is running, access the Swagger documentation at:
```
http://localhost:8080/api-docs
```

## API Endpoints

### Authentication (Auth)
- **POST** `/auth/request-otp` - Request OTP for phone number
- **POST** `/auth/resend-otp` - Resend OTP (returns same OTP if still valid within 5 minutes)
- **POST** `/auth/verify-otp` - Verify OTP and get JWT tokens
- **GET** `/auth/profile` 🔒 - Get authenticated user profile

### Public Cohorts
- **GET** `/v1/cohorts` - Get all active cohorts
- **GET** `/v1/cohorts/:id` - Get cohort by ID (only active)

### Admin Cohorts 🔒
- **GET** `/v1/admin/cohorts` - Get all cohorts (including inactive)
- **GET** `/v1/admin/cohorts/:id` - Get cohort by ID (including inactive)
- **POST** `/v1/admin/cohort` - Create new cohort
- **PATCH** `/v1/admin/cohort/:id` - Update cohort
- **DELETE** `/v1/admin/cohort/:id` - Soft delete cohort

### File Management 🔒
- **POST** `/files/upload/initiate` 🔒 - Initiate file upload (get signed URL)
- **POST** `/files/upload/complete` - Complete file upload (callback endpoint)
- **POST** `/files/upload/test` 🔒 - Test file upload (backend testing)
- **GET** `/files/:id` 🔒 - Get file metadata by ID

## Authentication

### JWT Bearer Token
Most endpoints require JWT authentication. To authenticate:

1. Request OTP: `POST /auth/request-otp`
2. Verify OTP: `POST /auth/verify-otp`
3. Copy the `accessToken` from the response
4. Click "Authorize" button in Swagger UI
5. Enter: `Bearer <your-access-token>`
6. Click "Authorize"

### OTP Flow (Non-Production)
In development/staging environments (NODE_ENV !== 'production'):
- OTP is always `123456` for easy testing
- OTP is valid for 5 minutes
- Same OTP is returned on resend if still valid

## Response Format

All successful responses are wrapped in:
```json
{
  "success": true,
  "data": {
    // ... actual response data
  }
}
```

All error responses are wrapped in:
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "timestamp": "2024-01-23T12:00:00.000Z",
    "path": "/api/endpoint"
  }
}
```

## Features

- **API Versioning**: Public and admin cohort endpoints use `/v1/` prefix
- **Role-Based Access**: Admin endpoints require admin role
- **OTP Authentication**: Mobile number + OTP based auth
- **File Upload**: Multipart upload with signed URLs and callback support
- **Soft Delete**: Cohorts are soft deleted (isActive: false)

## Tags

- **Auth**: Authentication endpoints
- **Cohorts**: Public cohort endpoints
- **Admin**: Admin endpoints (require admin role)
- **Files**: File upload endpoints

## Notes

- 🔒 = Requires JWT authentication
- All timestamps are in ISO 8601 format
- File uploads support callbacks for completion notification
- Admin endpoints require both JWT authentication and admin role

