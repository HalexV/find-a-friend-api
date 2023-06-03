import {
  PetCreateInput,
  PetWithAdoptionRequirements,
  PetsRepository,
} from '../pets-repository';
import { randomUUID } from 'node:crypto';

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

    this.items.push(pet);

    return pet;
  }
}
