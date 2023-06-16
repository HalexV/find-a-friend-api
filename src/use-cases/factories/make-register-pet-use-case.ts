import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';
import { RegisterPetUseCase } from '../pets/register-pet';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';

export function makeRegisterPetUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const petsRepository = new PrismaPetsRepository(
    adoptionRequirementsRepository
  );
  const registerPetUseCase = new RegisterPetUseCase(
    orgsRepository,
    adoptionRequirementsRepository,
    petsRepository
  );

  return registerPetUseCase;
}
