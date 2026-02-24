import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

const WEBHOOK_SECRET_HEADER = 'x-webhook-secret';

@Injectable()
export class OrderWebhookGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers[WEBHOOK_SECRET_HEADER];
    const expected = this.configService.get<string>('ORDER_WEBHOOK_SECRET');
    if (!expected) {
      throw new UnauthorizedException('Webhook not configured');
    }
    if (secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
    return true;
  }
}
