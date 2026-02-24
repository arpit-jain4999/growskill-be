import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const TENANT_RESOLVER = "TENANT_RESOLVER";
export declare const DEFAULT_X_ORG_ID = "698b0f6076ca77d98d706e65";
export interface ITenantResolver {
    resolveOrgId(headerValue: string | undefined): Promise<string | null>;
}
export declare class TenantContextGuard implements CanActivate {
    private reflector;
    private tenantResolver?;
    constructor(reflector: Reflector, tenantResolver?: ITenantResolver);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class RequireTenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
