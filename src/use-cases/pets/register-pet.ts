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
import { PetsRepository } from '@/repositories/pets-repository';
// import { prisma } from '@/lib/prisma';

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
  available: boolean;
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
// const a = await prisma.pet.create({data: {about:'',age: 'ADULT',ambience: 'BIG',available:true, energy_level:'AVERAGE',independence_level:'AVERAGE',name: '',size: 'BIG',type: 'CAT',adoption_requirements: {connect: {id: 'asd'}},org_id: 'asd'},include: {adoption_requirements:{select: {id: true}}}});

// a.
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
    await this.petsRepository.create({
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

    // Create photos with pet_id
  }
}
