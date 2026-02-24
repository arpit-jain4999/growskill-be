import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Actor } from '../types/actor';
export declare const PERMISSIONS_SERVICE = "PERMISSIONS_SERVICE";
export declare class AuthorizeGuard implements CanActivate {
    private reflector;
    private permissionsService?;
    constructor(reflector: Reflector, permissionsService?: {
        hasPermission(actor: Actor, permission: string): Promise<boolean>;
    });
    canActivate(context: ExecutionContext): Promise<boolean>;
}
