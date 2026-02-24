import { OrganizationRepository } from './repositories/organization.repository';
export declare class TenantResolutionService {
    private readonly organizationRepository;
    constructor(organizationRepository: OrganizationRepository);
    resolveOrgId(headerValue: string | undefined): Promise<string | null>;
}
