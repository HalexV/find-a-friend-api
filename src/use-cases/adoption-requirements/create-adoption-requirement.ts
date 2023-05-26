import { OrgsRepository } from '@/repositories/orgs-repository';
import { AdoptionRequirement } from '@prisma/client';

import { AdoptionRequirementsRepository } from '@/repositories/adoption-requirements-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface CreateAdoptionRequirementUseCaseRequest {
  orgId: string;
  title: string;
}

interface CreateAdoptionRequirementUseCaseResponse {
  adoptionRequirement: AdoptionRequirement;
}

export class CreateAdoptionRequirementUseCase {
  constructor(
    private adoptionRequirementsRepository: AdoptionRequirementsRepository,
    private orgsRepository: OrgsRepository
  ) {}

  async execute({
    orgId,
    title,
  }: CreateAdoptionRequirementUseCaseRequest): Promise<CreateAdoptionRequirementUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const adoptionRequirement =
      await this.adoptionRequirementsRepository.create({
        org_id: orgId,
        title,
      });

    return {
      adoptionRequirement,
    };
  }
}
