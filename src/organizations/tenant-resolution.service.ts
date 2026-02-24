import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './repositories/organization.repository';

/**
 * Resolves a valid organization ID from the x-org-id header.
 * Used by TenantContextGuard so PLATFORM_OWNER can act in a tenant context when the header is sent.
 */
@Injectable()
export class TenantResolutionService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  /**
   * Returns the organization ID if the value is a valid existing org; otherwise null.
   */
  async resolveOrgId(headerValue: string | undefined): Promise<string | null> {
    const trimmed = headerValue?.trim();
    if (!trimmed) return null;
    const org = await this.organizationRepository.findById(trimmed);
    return org ? org._id.toString() : null;
  }
}
