import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { RemovePhotoUseCase } from './remove-photo';
import { Readable } from 'node:stream';

let photosRepository: InMemoryPhotosRepository;
let sut: RemovePhotoUseCase;

describe('Photos - Register Photo Use Case', () => {
  beforeEach(() => {
    photosRepository = new InMemoryPhotosRepository();

    sut = new RemovePhotoUseCase(photosRepository);
  });

  it('should not be able to remove a pet photo when photo does not exist', async () => {
    const promise = sut.execute({
      photoId: 'non-existent-id',
    });

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to remove a pet photo', async () => {
    const photo = await photosRepository.create({
      petId: '123',
      file: Readable.from('abc'),
    });

    await sut.execute({
      photoId: photo.id,
    });

    expect(photosRepository.items.length).toBe(0);
  });
});
