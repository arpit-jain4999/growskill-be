# Common Services

This directory contains centralized services, utilities, and shared functionality used across the application.

## Services

### LoggerService (`services/logger.service.ts`)

A centralized logging service that implements NestJS's `LoggerService` interface.

**Usage:**
```typescript
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class MyService {
  constructor(private logger: LoggerService) {
    this.logger.setContext('MyService');
  }

  someMethod() {
    this.logger.log('Info message');
    this.logger.error('Error message', 'stack trace');
    this.logger.warn('Warning message');
    this.logger.debug('Debug message');
  }
}
```

## Filters

### HttpExceptionFilter (`filters/http-exception.filter.ts`)

Global exception filter that standardizes error responses across the application.

**Features:**
- Standardized error response format
- Automatic error logging
- Different log levels based on status code

**Response Format:**
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

## Middlewares

### LoggingMiddleware (`middlewares/logging.middleware.ts`)

Middleware that logs all HTTP requests with method, URL, status code, and response time.

**Features:**
- Request/response logging
- Performance tracking (duration)
- Different log levels based on status code

## Decorators

### @CurrentUser (`decorators/current-user.decorator.ts`)

Extracts the authenticated user from the request.

**Usage:**
```typescript
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: CurrentUserPayload) {
  return { user };
}
```

### @Public (`decorators/public.decorator.ts`)

Marks a route as public (bypasses JWT authentication).

**Usage:**
```typescript
import { Public } from '../common/decorators/public.decorator';

@Get('public-endpoint')
@Public()
getPublicData() {
  return { data: 'public' };
}
```

### @Roles (`decorators/roles.decorator.ts`)

Decorator for role-based access control (for future use).

**Usage:**
```typescript
import { Roles } from '../common/decorators/roles.decorator';

@Get('admin-only')
@Roles('admin')
getAdminData() {
  return { data: 'admin' };
}
```

## Guards

### JwtAuthGuard (`guards/jwt-auth.guard.ts`)

Enhanced JWT authentication guard that respects the `@Public()` decorator.

**Features:**
- Automatic JWT validation
- Respects `@Public()` decorator
- Can be extended for role-based access

**Usage:**
```typescript
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  // All routes require authentication
}
```

## Module

### CommonModule (`common.module.ts`)

Global module that exports common services. This module is marked as `@Global()`, so its providers are available throughout the application without importing in each module.

