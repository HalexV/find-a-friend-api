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
import { Readable } from 'node:stream';
import { PhotosRepository } from '@/repositories/photos-repository';
// import { prisma } from '@/lib/prisma';

interface PhotoStream {
  file: Readable;
  type: 'JPEG';
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
  photos: PhotoStream[];
  adoptionRequirementsIds: string[];
}

interface RegisterPetUseCaseResponse {
  pet: PetWithAdoptionRequirements & { photos: string[] };
}

export class RegisterPetUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private adoptionRequirementsRepository: AdoptionRequirementsRepository,
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository
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

    const petWithAdoptionRequirementsAndPhotos = Object.assign({}, pet, {
      photos: [] as string[],
    });

    for (const photoObject of photos) {
      const photo = await this.photosRepository.create({
        file: photoObject.file,
        petId: pet.id,
      });

      petWithAdoptionRequirementsAndPhotos.photos.push(photo.url);
    }

    return { pet: petWithAdoptionRequirementsAndPhotos };
  }
}
