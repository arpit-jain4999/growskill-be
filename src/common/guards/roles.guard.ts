import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // No user, deny access
    }

    // TODO: Implement actual role checking logic
    // For now, this is a placeholder that will need to be implemented
    // based on your user model and role system
    // Example:
    // return requiredRoles.some((role) => user.roles?.includes(role));

    // Placeholder: Allow if user exists (will be replaced with actual role check)
    return true;
  }
}

