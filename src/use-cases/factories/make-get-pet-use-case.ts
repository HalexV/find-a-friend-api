import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { PrismaPhotosRepository } from '@/repositories/prisma/prisma-photos-repository';
import { GetPetUseCase } from '../pets/get-pet';

export function makeGetPetUseCase() {
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const petsRepository = new PrismaPetsRepository(
    adoptionRequirementsRepository
  );
  const photosRepository = new PrismaPhotosRepository();

  const getPetUseCase = new GetPetUseCase(petsRepository, photosRepository);

  return getPetUseCase;
}
