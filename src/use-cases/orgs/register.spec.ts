import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import argon2 from 'argon2';
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error';

let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterUseCase;

describe('Orgs - Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new RegisterUseCase(orgsRepository);
  });

  it('should be able to register', async () => {
    const { org } = await sut.execute({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it('should be able to hash password', async () => {
    const { org } = await sut.execute({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const isPasswordCorrectlyHashed = await argon2.verify(
      org.password_hash,
      '12345678'
    );

    expect('12345678').not.toEqual(org.password_hash);
    expect(isPasswordCorrectlyHashed).toBeTruthy();
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const promise = sut.execute({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    await expect(promise).rejects.toBeInstanceOf(OrgAlreadyExistsError);
  });
});
