import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('LoggingMiddleware');
  }

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const { method, url } = req;
    const startTime = Date.now();

    // For Fastify raw objects, use finish event directly
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const logMessage = `${method} ${url} ${statusCode} - ${duration}ms`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}

