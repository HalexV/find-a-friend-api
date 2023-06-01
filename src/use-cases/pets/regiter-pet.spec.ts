import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterPetUseCase } from './register-pet';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterPetUseCase;

describe('Pets - Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new RegisterPetUseCase(orgsRepository);
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
});
