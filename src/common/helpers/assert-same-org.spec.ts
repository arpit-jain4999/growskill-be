import { ForbiddenException } from '@nestjs/common';
import { assertSameOrg } from './assert-same-org';

describe('assertSameOrg', () => {
  it('allows when resource and actor belong to same org', () => {
    expect(() =>
      assertSameOrg('org1', 'org1'),
    ).not.toThrow();
  });

  it('throws ForbiddenException when resource belongs to different org', () => {
    expect(() => assertSameOrg('org1', 'org2')).toThrow(ForbiddenException);
    expect(() => assertSameOrg('org1', 'org2')).toThrow(
      'resource belongs to another organization',
    );
  });

  it('throws when actor has no tenant context', () => {
    expect(() => assertSameOrg('org1', null)).toThrow(ForbiddenException);
    expect(() => assertSameOrg('org1', undefined)).toThrow(ForbiddenException);
    expect(() => assertSameOrg('org1', '')).toThrow('Tenant context required');
  });
});
