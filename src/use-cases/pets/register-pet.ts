import { OrgsRepository } from '@/repositories/orgs-repository';
import {
  Age,
  Ambience,
  EnergyLevel,
  IndependenceLevel,
  Pet,
  Size,
  Type,
} from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { AdoptionRequirementsRepository } from '@/repositories/adoption-requirements-repository';

interface Photo {
  title: string;
  file: any;
  datetime: Date;
  size: number;
}

interface RegisterPetUseCaseRequest {
  about: string;
  age: Age;
  ambience: Ambience;
  available: Boolean;
  energyLevel: EnergyLevel;
  independenceLevel: IndependenceLevel;
  name: string;
  size: Size;
  type: Type;
  orgId: string;
  photos?: ReadableStream<Photo>;
  adoptionRequirementsIds: string[];
}

interface RegisterPetUseCaseResponse {
  pet: Pet;
}

export class RegisterPetUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private adoptionRequirementsRepository: AdoptionRequirementsRepository
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
    photos,
    adoptionRequirementsIds,
  }: RegisterPetUseCaseRequest): Promise<void> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) throw new ResourceNotFoundError();

    for (const id of adoptionRequirementsIds) {
      const adoptionRequirement =
        await this.adoptionRequirementsRepository.findById(id);

      if (!adoptionRequirement) throw new ResourceNotFoundError();
    }

    // Create pet and relate with adoption requirements (if exists)

    // Create photos with pet_id
  }
}
