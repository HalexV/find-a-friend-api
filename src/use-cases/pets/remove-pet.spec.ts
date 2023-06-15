import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { RemovePetUseCase } from './remove-pet';

let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: RemovePetUseCase;

describe('Pets - Remove Pet Use Case', () => {
  beforeEach(() => {
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    petsRepository = new InMemoryPetsRepository(adoptionRequirementsRepository);

    sut = new RemovePetUseCase(petsRepository);
  });

  it('should not be able to remove a pet when pet does not exist', async () => {
    const promise = sut.execute({
      petId: 'non-existent-id',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
