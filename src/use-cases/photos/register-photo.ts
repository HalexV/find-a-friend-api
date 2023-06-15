import { Photo } from '@prisma/client';
import { Readable } from 'node:stream';
import { PhotosRepository } from '@/repositories/photos-repository';
import { PetsRepository } from '@/repositories/pets-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface PhotoStream {
  file: Readable;
  type: 'JPEG';
}

interface RegisterPhotoUseCaseRequest {
  petId: string;
  photo: PhotoStream;
}

interface RegisterPhotoUseCaseResponse {
  photo: Photo;
}

export class RegisterPhotoUseCase {
  constructor(
    private photosRepository: PhotosRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute({
    petId,
    photo,
  }: RegisterPhotoUseCaseRequest): Promise<RegisterPhotoUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      photo.file.destroy();
      throw new ResourceNotFoundError();
    }

    const photoCreated = await this.photosRepository.create({
      file: photo.file,
      petId,
    });

    return { photo: photoCreated };
  }
}
