import { PhotosRepository } from '@/repositories/photos-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface RemovePhotoUseCaseRequest {
  photoId: string;
}

export class RemovePhotoUseCase {
  constructor(private photosRepository: PhotosRepository) {}

  async execute({ photoId }: RemovePhotoUseCaseRequest): Promise<void> {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new ResourceNotFoundError();
    }

    await this.photosRepository.delete(photo.id);
  }
}
