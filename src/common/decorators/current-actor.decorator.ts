import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Actor } from '../types/actor';

export const CurrentActor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Actor => {
    const request = ctx.switchToHttp().getRequest();
    const actor = request.actor;
    if (!actor) {
      throw new Error('Actor not set; ensure JwtAuthGuard and tenant context run first');
    }
    return actor;
  },
);
