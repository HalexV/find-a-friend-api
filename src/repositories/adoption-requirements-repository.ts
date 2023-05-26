import { AdoptionRequirement, Prisma } from '@prisma/client';

export interface AdoptionRequirementsRepository {
  create(
    data: Prisma.AdoptionRequirementUncheckedCreateInput
  ): Promise<AdoptionRequirement>;
}
