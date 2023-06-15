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
import { PetsRepository } from '@/repositories/pets-repository';
import { PhotosRepository } from '@/repositories/photos-repository';

interface FetchPetsFilters {
  age?: Age;
  ambience?: Ambience;
  energyLevel?: EnergyLevel;
  independenceLevel?: IndependenceLevel;
  size?: Size;
  type?: Type[];
}

interface FetchPetsByCityUseCaseRequest {
  city: string;
  filters?: FetchPetsFilters;
}

export interface PetComplete extends Pet {
  adoption_requirements: string[];
  photos: string[];
}

interface FetchPetsByCityUseCaseResponse {
  pets: PetComplete[];
}

export class FetchPetsByCityUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository
  ) {}

  async execute({
    city,
    filters,
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    const orgs = await this.orgsRepository.findManyByCity(
      city.toLocaleLowerCase()
    );

    if (orgs.length === 0) {
      throw new ResourceNotFoundError();
    }

    const pets = await this.petsRepository.findManyByOrgIds({
      orgIds: orgs.map((org) => org.id),
      filters: { ...filters, available: true },
    });

    const completedPets = [];

    for (const pet of pets) {
      const photos = await this.photosRepository.findManyByPetId(pet.id);

      completedPets.push(
        Object.assign({}, pet, { photos: photos.map((photo) => photo.url) })
      );
    }

    return {
      pets: completedPets,
    };
  }
}
