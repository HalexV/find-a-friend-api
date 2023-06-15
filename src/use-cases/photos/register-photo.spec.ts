import {
  expect,
  describe,
  it,
  beforeEach,
  vi,
  afterEach,
  afterAll,
} from 'vitest';

import { open } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository';
import { RegisterPhotoUseCase } from './register-photo';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';

const basePath = join(__dirname, '../../utils/test/images');

const streams: Readable[] = [];

let photosRepository: InMemoryPhotosRepository;
let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterPhotoUseCase;

describe('Photos - Register Photo Use Case', () => {
  beforeEach(() => {
    photosRepository = new InMemoryPhotosRepository();

    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    petsRepository = new InMemoryPetsRepository(adoptionRequirementsRepository);

    orgsRepository = new InMemoryOrgsRepository();

    sut = new RegisterPhotoUseCase(photosRepository, petsRepository);

    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    streams.forEach((stream) => stream.destroy());
  });

  it('should be able to register a pet photo', async () => {
    const createdAt = new Date('2023-01-01');

    vi.setSystemTime(createdAt);

    const fd1 = await open(join(basePath, 'image1.jpg'));

    const stream1 = fd1.createReadStream();

    streams.push(stream1);

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

    const pet = await petsRepository.create({
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
    });

    const { photo } = await sut.execute({
      petId: pet.id,
      photo: { file: stream1, type: 'JPEG' },
    });

    const expectedPhoto = {
      url: expect.any(String),
    };

    expect(photo).toMatchObject(expectedPhoto);
  });
});
