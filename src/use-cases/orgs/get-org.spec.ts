import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { GetOrgUseCase } from './get-org';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let orgsRepository: InMemoryOrgsRepository;
let sut: GetOrgUseCase;

describe('Orgs - Get Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new GetOrgUseCase(orgsRepository);
  });

  it('should not be able to get a org with a non-existent id', async () => {
    const promise = sut.execute({
      orgId: 'non-existent-id',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
