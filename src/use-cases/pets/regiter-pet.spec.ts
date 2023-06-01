import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterPetUseCase } from './register-pet';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';

let orgsRepository: InMemoryOrgsRepository;
let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let sut: RegisterPetUseCase;

describe('Pets - Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    sut = new RegisterPetUseCase(
      orgsRepository,
      adoptionRequirementsRepository
    );
  });

  it('should not be able to register a pet when org does not exist', async () => {
    const promise = sut.execute({
      about: 'any',
      adoptionRequirementsIds: [],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'AVERAGE',
      independenceLevel: 'HIGH',
      name: 'Mark',
      orgId: 'non-existent-id',
      size: 'MEDIUM',
      type: 'DOG',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to register a pet when some adoption requirement does not exist', async () => {
    const org = await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const adoptionRequirement = await adoptionRequirementsRepository.create({
      org_id: org.id,
      title: 'Cold weather',
    });

    const promise = sut.execute({
      about: 'any',
      adoptionRequirementsIds: ['non-existent-id', adoptionRequirement.id],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'AVERAGE',
      independenceLevel: 'HIGH',
      name: 'Mark',
      orgId: org.id,
      size: 'MEDIUM',
      type: 'DOG',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
