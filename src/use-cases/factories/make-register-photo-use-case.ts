import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { RegisterPhotoUseCase } from '../photos/register-photo';
import { PrismaPhotosRepository } from '@/repositories/prisma/prisma-photos-repository';

export function makeRegisterPhotoUseCase() {
  const photosRepository = new PrismaPhotosRepository();
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const petsRepository = new PrismaPetsRepository(
    adoptionRequirementsRepository
  );
  const registerPhotoUseCase = new RegisterPhotoUseCase(
    photosRepository,
    petsRepository
  );

  return registerPhotoUseCase;
}
