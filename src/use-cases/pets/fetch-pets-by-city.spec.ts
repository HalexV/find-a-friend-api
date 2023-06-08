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
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';

import { open } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository';

const basePath = join(__dirname, '../../utils/test/images');

const streams: Readable[] = [];

let orgsRepository: InMemoryOrgsRepository;
let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let petsRepository: InMemoryPetsRepository;
let photosRepository: InMemoryPhotosRepository;
let sut: FetchPetsByCityUseCase;

describe('Pets - Fetch Pets By City Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    petsRepository = new InMemoryPetsRepository(adoptionRequirementsRepository);
    photosRepository = new InMemoryPhotosRepository();

    sut = new FetchPetsByCityUseCase(
      orgsRepository,
      petsRepository,
      photosRepository
    );
    // vi.useFakeTimers();
    // vi.restoreAllMocks();
  });

  afterEach(() => {
    // vi.useRealTimers();
  });

  afterAll(() => {
    streams.forEach((stream) => stream.destroy());
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

  it('should be able to fetch pets from a city without filters', async () => {
    const fd1 = await open(join(basePath, 'image1.jpg'));
    const fd2 = await open(join(basePath, 'image2.jpg'));

    const stream1 = fd1.createReadStream();
    const stream2 = fd2.createReadStream();

    streams.push(stream1, stream2);

    const orgColorado = await orgsRepository.create({
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

    const orgVilhena = await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'vilhena',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const adoptionRequirementA = await adoptionRequirementsRepository.create({
      org_id: orgColorado.id,
      title: 'Cold weather',
    });

    const adoptionRequirementB = await adoptionRequirementsRepository.create({
      org_id: orgColorado.id,
      title: 'It needs a yard',
    });

    const petMark = await petsRepository.create({
      about: 'any',
      adoption_requirements: [adoptionRequirementA.id, adoptionRequirementB.id],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
    });

    await petsRepository.create({
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Charles',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
    });

    await petsRepository.create({
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Carlitos',
      org_id: orgVilhena.id,
      size: 'BIG',
      type: 'CAT',
    });

    await photosRepository.create({
      file: stream1,
      petId: petMark.id,
    });

    await photosRepository.create({
      file: stream2,
      petId: petMark.id,
    });

    const { pets } = await sut.execute({
      city: 'Colorado',
    });

    const expectedPetMark = {
      about: 'any',
      adoption_requirements: ['Cold weather', 'It needs a yard'],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
      photos: [expect.any(String), expect.any(String)],
    };

    const expectedPetCharles = {
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Charles',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
      photos: [],
    };

    expect(pets[0]).toMatchObject(expectedPetMark);
    expect(pets[1]).toMatchObject(expectedPetCharles);
  });

  it('should be able to fetch pets from a city with filters', async () => {
    const fd1 = await open(join(basePath, 'image1.jpg'));
    const fd2 = await open(join(basePath, 'image2.jpg'));

    const stream1 = fd1.createReadStream();
    const stream2 = fd2.createReadStream();

    streams.push(stream1, stream2);

    const orgColorado = await orgsRepository.create({
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

    const orgVilhena = await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'vilhena',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: '12345678',
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const adoptionRequirementA = await adoptionRequirementsRepository.create({
      org_id: orgColorado.id,
      title: 'Cold weather',
    });

    const adoptionRequirementB = await adoptionRequirementsRepository.create({
      org_id: orgColorado.id,
      title: 'It needs a yard',
    });

    const petMark = await petsRepository.create({
      about: 'any',
      adoption_requirements: [adoptionRequirementA.id, adoptionRequirementB.id],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
    });

    await petsRepository.create({
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Charles',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
    });

    await petsRepository.create({
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Carlitos',
      org_id: orgVilhena.id,
      size: 'BIG',
      type: 'CAT',
    });

    await petsRepository.create({
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'LOW',
      independence_level: 'AVERAGE',
      name: 'Martin',
      org_id: orgColorado.id,
      size: 'SMALL',
      type: 'CAT',
    });

    await photosRepository.create({
      file: stream1,
      petId: petMark.id,
    });

    await photosRepository.create({
      file: stream2,
      petId: petMark.id,
    });

    const { pets: petsA } = await sut.execute({
      city: 'Colorado',
    });

    const { pets: petsB } = await sut.execute({
      city: 'Colorado',
      filters: {
        age: 'PUPPY',
        ambience: 'MEDIUM',
        energyLevel: 'AVERAGE',
        independenceLevel: 'HIGH',
        size: 'MEDIUM',
        type: ['DOG'],
      },
    });

    const { pets: petsC } = await sut.execute({
      city: 'Colorado',
      filters: {
        age: 'ADULT',
        type: ['CAT', 'DOG'],
      },
    });

    const { pets: petsD } = await sut.execute({
      city: 'Vilhena',
      filters: {
        type: ['DOG'],
      },
    });

    const { pets: petsE } = await sut.execute({
      city: 'Colorado',
      filters: {
        ambience: 'MEDIUM',
        type: ['CAT', 'DOG'],
      },
    });

    const expectedPetMark = {
      about: 'any',
      adoption_requirements: ['Cold weather', 'It needs a yard'],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Mark',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
      photos: [expect.any(String), expect.any(String)],
    };

    const expectedPetCharles = {
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'AVERAGE',
      independence_level: 'HIGH',
      name: 'Charles',
      org_id: orgColorado.id,
      size: 'MEDIUM',
      type: 'DOG',
      photos: [],
    };

    const expectedPetMartin = {
      about: 'any',
      adoption_requirements: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energy_level: 'LOW',
      independence_level: 'AVERAGE',
      name: 'Martin',
      org_id: orgColorado.id,
      size: 'SMALL',
      type: 'CAT',
      photos: [],
    };

    expect(petsA).toMatchObject([
      expectedPetMark,
      expectedPetCharles,
      expectedPetMartin,
    ]);
    expect(petsB).toMatchObject([expectedPetMark]);
    expect(petsC).toMatchObject([expectedPetCharles, expectedPetMartin]);
    expect(petsD).toMatchObject([]);
    expect(petsE).toMatchObject([
      expectedPetMark,
      expectedPetCharles,
      expectedPetMartin,
    ]);
  });
});
