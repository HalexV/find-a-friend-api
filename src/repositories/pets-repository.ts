import {
  Age,
  Ambience,
  EnergyLevel,
  IndependenceLevel,
  Pet,
  Prisma,
  Size,
  Type,
} from '@prisma/client';
import { AdoptionRequirementsRepository } from './adoption-requirements-repository';

export interface PetWithAdoptionRequirements extends Pet {
  adoption_requirements: string[];
}

interface Filters {
  age?: Age;
  ambience?: Ambience;
  energy_level?: EnergyLevel;
  independence_level?: IndependenceLevel;
  size?: Size;
  type?: Type[];
  available?: boolean;
}

interface PetFindIpunt {
  filters?: Filters;
}

export interface PetFindManyByOrgIds extends PetFindIpunt {
  orgIds: string[];
}

export interface PetCreateInput
  extends Omit<
    Prisma.PetUncheckedCreateInput,
    'adoption_requirements' | 'photos'
  > {
  adoption_requirements: string[];
}
export abstract class PetsRepository {
  constructor(
    protected adoptionRequirementsRepository: AdoptionRequirementsRepository
  ) {}

  abstract create(data: PetCreateInput): Promise<PetWithAdoptionRequirements>;
  abstract delete(id: string): Promise<void>;
  abstract findManyByOrgIds(
    data: PetFindManyByOrgIds
  ): Promise<PetWithAdoptionRequirements[]>;
}
