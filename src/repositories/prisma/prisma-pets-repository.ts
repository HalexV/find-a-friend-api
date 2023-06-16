import { prisma } from '@/lib/prisma';
import {
  PetCreateInput,
  PetFindManyByOrgIds,
  PetWithAdoptionRequirements,
  PetsRepository,
} from '../pets-repository';
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

export class PrismaPetsRepository extends PetsRepository {
  async create(data: PetCreateInput): Promise<PetWithAdoptionRequirements> {
    const adoptionRequirementsIds = data.adoption_requirements.map((id) => ({
      id,
    }));

    const pet = await prisma.pet.create({
      data: {
        about: data.about,
        age: data.age,
        ambience: data.ambience,
        available: data.available,
        energy_level: data.energy_level,
        independence_level: data.independence_level,
        name: data.name,
        size: data.size,
        type: data.type,
        org_id: data.org_id,
        adoption_requirements: {
          connect: adoptionRequirementsIds,
        },
      },
      include: { adoption_requirements: { select: { title: true } } },
    });

    const adoptionRequirementsTitles = pet.adoption_requirements.map(
      (adoptionRequirement) => adoptionRequirement.title
    );

    const createdPet = Object.assign({}, pet, {
      adoption_requirements: adoptionRequirementsTitles,
    });

    return createdPet;
  }

  async delete(id: string): Promise<void> {
    await prisma.pet.update({
      where: { id },
      data: {
        adoption_requirements: {
          set: [],
        },
      },
      include: { adoption_requirements: true },
    });

    await prisma.pet.delete({ where: { id } });
  }

  async findById(id: string): Promise<PetWithAdoptionRequirements | null> {
    const foundPet = await prisma.pet.findFirst({
      where: { id },
      include: { adoption_requirements: { select: { title: true } } },
    });

    if (!foundPet) return null;

    const adoptionRequirementsTitles = foundPet.adoption_requirements.map(
      (adoptionRequirement) => adoptionRequirement.title
    );

    const pet = Object.assign({}, foundPet, {
      adoption_requirements: adoptionRequirementsTitles,
    });

    return pet;
  }

  async findManyByOrgIds(
    data: PetFindManyByOrgIds
  ): Promise<PetWithAdoptionRequirements[]> {
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
      data.filters
    ) as Filters | null;

    const whereQuery = { org_id: { in: data.orgIds } };

    if (selectedFilters) {
      for (const key of Object.keys(selectedFilters) as Array<keyof Filters>) {
        if (key === 'type') {
          Object.assign(whereQuery, {
            type: {
              in: selectedFilters.type,
            },
          });
        } else {
          Reflect.defineProperty(whereQuery, key, {
            value: selectedFilters[key],
            enumerable: true,
          });
        }
      }
    }

    const selectedPets = await prisma.pet.findMany({
      where: whereQuery,
      include: { adoption_requirements: { select: { title: true } } },
    });

    const pets = [];

    for (const selectedPet of selectedPets) {
      const adoptionRequirementsTitles = selectedPet.adoption_requirements.map(
        (adoptionRequirement) => adoptionRequirement.title
      );

      const pet = Object.assign({}, selectedPet, {
        adoption_requirements: adoptionRequirementsTitles,
      });

      pets.push(pet);
    }

    return pets;
  }
}
