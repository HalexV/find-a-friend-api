import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { GetOrgUseCase } from './get-org';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import argon2 from 'argon2';

let orgsRepository: InMemoryOrgsRepository;
let sut: GetOrgUseCase;

describe('Orgs - Get Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new GetOrgUseCase(orgsRepository);
  });

  it('should be able to get an org', async () => {
    const orgCreated = await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: await argon2.hash('12345678'),
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const { org } = await sut.execute({ orgId: orgCreated.id });

    expect(org).toEqual(orgCreated);
  });

  it('should not be able to get an org with a non-existent id', async () => {
    const promise = sut.execute({
      orgId: 'non-existent-id',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
