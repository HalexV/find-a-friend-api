import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { RegisterPetUseCase } from './register-pet';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';

let orgsRepository: InMemoryOrgsRepository;
let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: RegisterPetUseCase;

describe('Pets - Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    petsRepository = new InMemoryPetsRepository(adoptionRequirementsRepository);

    sut = new RegisterPetUseCase(
      orgsRepository,
      adoptionRequirementsRepository,
      petsRepository
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('should be able to create a pet without adoption requirements', async () => {
    const createdAt = new Date('2023-01-01');

    vi.setSystemTime(createdAt);

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

    await sut.execute({
      about: 'any',
      adoptionRequirementsIds: [],
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

    const expectedPet = {
      about: 'any',
      adoption_requirements: [],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: org.id,
      size: 'MEDIUM',
      type: 'DOG',
      created_at: createdAt,
      updated_at: createdAt,
    };

    const pet = petsRepository.items[0];

    expect(pet).toMatchObject(expectedPet);
  });

  it('should be able to create a pet with adoption requirements', async () => {
    const createdAt = new Date('2023-01-01');

    vi.setSystemTime(createdAt);

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

    const adoptionRequirementA = await adoptionRequirementsRepository.create({
      org_id: org.id,
      title: 'Cold weather',
    });

    const adoptionRequirementB = await adoptionRequirementsRepository.create({
      org_id: org.id,
      title: 'It needs a yard',
    });

    await sut.execute({
      about: 'any',
      adoptionRequirementsIds: [
        adoptionRequirementA.id,
        adoptionRequirementB.id,
      ],
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

    const expectedPet = {
      about: 'any',
      adoption_requirements: [adoptionRequirementA.id, adoptionRequirementB.id],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: org.id,
      size: 'MEDIUM',
      type: 'DOG',
      created_at: createdAt,
      updated_at: createdAt,
    };

    const pet = petsRepository.items[0];

    expect(pet).toMatchObject(expectedPet);
  });
});
