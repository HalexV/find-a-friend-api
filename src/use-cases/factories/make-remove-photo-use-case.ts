import { PrismaPhotosRepository } from '@/repositories/prisma/prisma-photos-repository';
import { RemovePhotoUseCase } from '../photos/remove-photo';

export function makeRemovePhotoUseCase() {
  const photosRepository = new PrismaPhotosRepository();
  const removePhotoUseCase = new RemovePhotoUseCase(photosRepository);

  return removePhotoUseCase;
}
