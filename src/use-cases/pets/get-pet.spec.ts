import {
  expect,
  describe,
  it,
  beforeEach,
  vi,
  afterEach,
  afterAll,
} from 'vitest';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';

// import { open } from 'node:fs/promises';
// import { join } from 'node:path';
// import { Readable } from 'node:stream';
import { GetPetUseCase } from './get-pet';

// const basePath = join(__dirname, '../../utils/test/images');

// const streams: Readable[] = [];

let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: GetPetUseCase;

describe('Pets - Get Pet Use Case', () => {
  beforeEach(() => {
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    petsRepository = new InMemoryPetsRepository(adoptionRequirementsRepository);

    sut = new GetPetUseCase(petsRepository);
    // vi.useFakeTimers();
    // vi.restoreAllMocks();
  });

  afterEach(() => {
    // vi.useRealTimers();
  });

  afterAll(() => {
    // streams.forEach((stream) => stream.destroy());
  });

  it('should not be able to get a pet that does not exist', async () => {
    const promise = sut.execute({
      petId: 'non-existent-id',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
