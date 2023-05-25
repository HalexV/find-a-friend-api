import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import argon2 from 'argon2';
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error';
import { AuthenticateUseCase } from './authenticate';

let orgsRepository: InMemoryOrgsRepository;
let sut: AuthenticateUseCase;

describe('Orgs - Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateUseCase(orgsRepository);
  });

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
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

    const { org } = await sut.execute({
      email: 'org@org.com',
      password: '12345678',
    });

    expect(org.id).toEqual(expect.any(String));
  });
});
