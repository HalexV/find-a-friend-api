import {
  PetCreateInput,
  PetFindManyByOrgIds,
  PetWithAdoptionRequirements,
  PetsRepository,
} from '../pets-repository';
import { randomUUID } from 'node:crypto';
import { AdoptionRequirementWithPets } from './in-memory-adoption-requirements-repository';
import { extractProperties } from '@/utils/extractProperties';
import {
  Age,
  Ambience,
  EnergyLevel,
  IndependenceLevel,
  Size,
  Type,
} from '@prisma/client';

interface Filters {
  age: Age;
  ambience: Ambience;
  energy_level: EnergyLevel;
  independence_level: IndependenceLevel;
  size: Size;
  type: Type[];
  available: boolean;
}
export class InMemoryPetsRepository extends PetsRepository {
  public items: PetWithAdoptionRequirements[] = [];

  async create(data: PetCreateInput): Promise<PetWithAdoptionRequirements> {
    const createdAt = new Date();

    const pet: PetWithAdoptionRequirements = {
      id: randomUUID(),
      about: data.about,
      adoption_requirements: data.adoption_requirements,
      age: data.age,
      ambience: data.ambience,
      available: data.available,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      name: data.name,
      org_id: data.org_id,
      size: data.size,
      type: data.type,
      created_at: createdAt,
      updated_at: createdAt,
    };

    const adoptionRequirementsTitles = [];

    for (const id of data.adoption_requirements) {
      const adoptionRequirement =
        (await this.adoptionRequirementsRepository.findById(
          id
        )) as AdoptionRequirementWithPets;

      adoptionRequirementsTitles.push(adoptionRequirement.title);

      adoptionRequirement.pets.push(pet.id);
    }

    this.items.push(pet);

    const petWithAdoptionRequirementsTitles = Object.assign({}, pet, {
      adoption_requirements: adoptionRequirementsTitles,
    });

    return petWithAdoptionRequirementsTitles;
  }

  async findById(id: string) {
    const pet = this.items.find((pet) => pet.id === id);

    if (!pet) return null;

    const adoptionRequirementsTitles = [];

    for (const id of pet.adoption_requirements) {
      const adoptionRequirement =
        await this.adoptionRequirementsRepository.findById(id);

      if (!adoptionRequirement) continue;

      adoptionRequirementsTitles.push(adoptionRequirement.title);
    }

    const petWithAdoptionRequirementsTitles = Object.assign({}, pet, {
      adoption_requirements: adoptionRequirementsTitles,
    });

    return petWithAdoptionRequirementsTitles;
  }

  async findManyByOrgIds({ orgIds, filters }: PetFindManyByOrgIds) {
    const selectedFilters = extractProperties(
      [
        'age',
        'ambience',
        'energy_level',
        'independence_level',
        'size',
        'type',
        'available',
      ],
      filters
    ) as Filters | null;

    const pets = this.items.filter((pet) => {
      const doesOrgIdsInclude = orgIds.includes(pet.org_id);
      let matchFilters = true;

      if (selectedFilters) {
        for (const key of Object.keys(selectedFilters) as Array<
          keyof Filters
        >) {
          if (key === 'type') {
            if (!selectedFilters[key].includes(pet[key])) {
              matchFilters = false;
              break;
            }
          } else {
            if (pet[key] !== selectedFilters[key]) {
              matchFilters = false;
              break;
            }
          }
        }
      }

      return doesOrgIdsInclude && matchFilters;
    });

    const filteredPets = [];

    for (const pet of pets) {
      const adoptionRequirementsTitles = [];

      for (const id of pet.adoption_requirements) {
        const adoptionRequirement =
          await this.adoptionRequirementsRepository.findById(id);

        if (!adoptionRequirement) continue;

        adoptionRequirementsTitles.push(adoptionRequirement.title);
      }

      filteredPets.push(
        Object.assign({}, pet, {
          adoption_requirements: adoptionRequirementsTitles,
        })
      );
    }

    return filteredPets;
  }

  async delete(id: string) {
    const petIndex = this.items.findIndex((pet) => pet.id === id);
    const pet = this.items[petIndex];

    for (const id of pet.adoption_requirements) {
      const adoptionRequirement =
        (await this.adoptionRequirementsRepository.findById(
          id
        )) as AdoptionRequirementWithPets;
      const petIndex = adoptionRequirement.pets.findIndex(
        (petId) => petId === pet.id
      );
      adoptionRequirement.pets.splice(petIndex, 1);
    }

    this.items.splice(petIndex, 1);
  }
}
