import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { RemovePetUseCase } from '../pets/remove-pet';
import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';

export function makeRemovePetUseCase() {
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const petsRepository = new PrismaPetsRepository(
    adoptionRequirementsRepository
  );
  const removePetUseCase = new RemovePetUseCase(petsRepository);

  return removePetUseCase;
}
