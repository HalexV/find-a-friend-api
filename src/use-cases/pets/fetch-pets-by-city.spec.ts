import {
  expect,
  describe,
  it,
  beforeEach,
  vi,
  afterEach,
  afterAll,
} from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { FetchPetsByCityUseCase } from './fetch-pets-by-city';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let orgsRepository: InMemoryOrgsRepository;
let sut: FetchPetsByCityUseCase;

describe('Pets - Fetch Pets By City Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();

    sut = new FetchPetsByCityUseCase(orgsRepository);
    // vi.useFakeTimers();
    // vi.restoreAllMocks();
  });

  afterEach(() => {
    // vi.useRealTimers();
  });

  afterAll(() => {
    // streams.forEach((stream) => stream.destroy());
  });

  it('should not be able to fetch pets from a city that was not registered', async () => {
    await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const promise = sut.execute({
      city: 'vilhena',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
