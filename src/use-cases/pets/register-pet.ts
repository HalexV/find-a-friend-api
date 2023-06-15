import { OrgsRepository } from '@/repositories/orgs-repository';
import {
  Age,
  Ambience,
  EnergyLevel,
  IndependenceLevel,
  Size,
  Type,
} from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { AdoptionRequirementsRepository } from '@/repositories/adoption-requirements-repository';
import {
  PetWithAdoptionRequirements,
  PetsRepository,
} from '@/repositories/pets-repository';

interface RegisterPetUseCaseRequest {
  about: string;
  age: Age;
  ambience: Ambience;
  available: boolean;
  energyLevel: EnergyLevel;
  independenceLevel: IndependenceLevel;
  name: string;
  size: Size;
  type: Type;
  orgId: string;
  adoptionRequirementsIds: string[];
}

interface RegisterPetUseCaseResponse {
  pet: PetWithAdoptionRequirements;
}

export class RegisterPetUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private adoptionRequirementsRepository: AdoptionRequirementsRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute({
    about,
    age,
    ambience,
    available,
    energyLevel,
    independenceLevel,
    name,
    size,
    type,
    orgId,
    adoptionRequirementsIds,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) throw new ResourceNotFoundError();

    for (const id of adoptionRequirementsIds) {
      const adoptionRequirement =
        await this.adoptionRequirementsRepository.findById(id);

      if (!adoptionRequirement) throw new ResourceNotFoundError();
    }

    const pet = await this.petsRepository.create({
      about,
      age,
      ambience,
      available,
      energy_level: energyLevel,
      independence_level: independenceLevel,
      name,
      size,
      type,
      org_id: orgId,
      adoption_requirements: adoptionRequirementsIds,
    });

    return { pet };
  }
}
