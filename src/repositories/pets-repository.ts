import { Pet, Prisma } from '@prisma/client';
import { AdoptionRequirementsRepository } from './adoption-requirements-repository';

export interface PetWithAdoptionRequirements extends Pet {
  adoption_requirements: string[];
}

export interface PetCreateInput
  extends Omit<Prisma.PetUncheckedCreateInput, 'adoption_requirements'> {
  adoption_requirements: string[];
}

export abstract class PetsRepository {
  constructor(
    private adoptionRequirementsRepository: AdoptionRequirementsRepository
  ) {}

  abstract create(data: PetCreateInput): Promise<PetWithAdoptionRequirements>;
}
