import { OrgsRepository } from '@/repositories/orgs-repository';
import {
  Age,
  Ambience,
  EnergyLevel,
  IndependenceLevel,
  Size,
  Type,
} from '@prisma/client';

import { PetComplete } from './register-pet';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

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

interface FetchPetsByCityUseCaseResponse {
  pets: PetComplete[];
}

export class FetchPetsByCityUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    city,
    filters,
  }: FetchPetsByCityUseCaseRequest): Promise<void> {
    const orgs = await this.orgsRepository.findManyByCity(
      city.toLocaleLowerCase()
    );

    if (orgs.length === 0) {
      throw new ResourceNotFoundError();
    }
  }
}
