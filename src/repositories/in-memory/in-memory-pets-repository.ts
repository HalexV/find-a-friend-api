import {
  PetCreateInput,
  PetWithAdoptionRequirements,
  PetsRepository,
} from '../pets-repository';
import { randomUUID } from 'node:crypto';
import { AdoptionRequirementWithPets } from './in-memory-adoption-requirements-repository';

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

  async findManyByOrgIds(orgIds: string[]) {
    const pets = this.items.filter((pet) => orgIds.includes(pet.org_id));

    for (const pet of pets) {
      const adoptionRequirementsTitles = [];

      for (const id of pet.adoption_requirements) {
        const adoptionRequirement =
          await this.adoptionRequirementsRepository.findById(id);

        if (!adoptionRequirement) continue;

        adoptionRequirementsTitles.push(adoptionRequirement.title);
      }

      pet.adoption_requirements = adoptionRequirementsTitles;
    }

    return pets;
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
