import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { PrismaAdoptionRequirementsRepository } from '@/repositories/prisma/prisma-adoption-requirements-repository';
import { FetchPetsByStateAndCityUseCase } from '../pets/fetch-pets-by-state-and-city';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { PrismaPhotosRepository } from '@/repositories/prisma/prisma-photos-repository';

export function makeFetchPetsByStateAndCityUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const adoptionRequirementsRepository =
    new PrismaAdoptionRequirementsRepository();
  const petsRepository = new PrismaPetsRepository(
    adoptionRequirementsRepository
  );
  const photosRepository = new PrismaPhotosRepository();

  const fetchPetsByStateAndCityUseCase = new FetchPetsByStateAndCityUseCase(
    orgsRepository,
    petsRepository,
    photosRepository
  );

  return fetchPetsByStateAndCityUseCase;
}
