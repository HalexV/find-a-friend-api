import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { CreateAdoptionRequirementUseCase } from '../adoption-requirements/create-adoption-requirement';
import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';

export function makeCreateAdoptionRequirementUseCase() {
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const orgsRepository = new PrismaOrgsRepository();
  const createAdoptionRequirementUseCase = new CreateAdoptionRequirementUseCase(
    adoptionRequirementsRepository,
    orgsRepository
  );

  return createAdoptionRequirementUseCase;
}
