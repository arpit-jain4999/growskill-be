import { NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../services/logger.service';
export declare class LoggingMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: LoggerService);
    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void): void;
}
