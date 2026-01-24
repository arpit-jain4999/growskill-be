import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response is already in the correct format, return as is
        // This handles cases where service might return pre-formatted responses
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Wrap successful responses in standard format
        // Note: Errors/exceptions are handled by HttpExceptionFilter,
        // which runs before this interceptor and bypasses the map operator
        return {
          success: true,
          data: data ?? null,
        };
      }),
    );
    // Note: Exceptions thrown in the handler will bypass this map operator
    // and be caught by the global HttpExceptionFilter, which formats them as:
    // { success: false, error: { message, statusCode, timestamp, path } }
  }
}

