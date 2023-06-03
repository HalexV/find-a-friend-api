import { Prisma, Org, AdoptionRequirement } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AdoptionRequirementsRepository } from '../adoption-requirements-repository';

export interface AdoptionRequirementWithPets extends AdoptionRequirement {
  pets: string[];
}
export class InMemoryAdoptionRequirementsRepository
  implements AdoptionRequirementsRepository
{
  public items: AdoptionRequirementWithPets[] = [];

  async create(data: Prisma.AdoptionRequirementUncheckedCreateInput) {
    const createdAt = new Date();

    const adoptionRequirement: AdoptionRequirementWithPets = {
      id: randomUUID(),
      org_id: data.org_id,
      title: data.title,
      created_at: createdAt,
      updated_at: createdAt,
      pets: [],
    };

    this.items.push(adoptionRequirement);

    return Object.assign({}, adoptionRequirement, {
      pets: undefined,
    }) as AdoptionRequirement;
  }

  async findById(id: string) {
    const adoptionRequirement = this.items.find((item) => item.id === id);

    if (!adoptionRequirement) return null;

    return adoptionRequirement;
  }
}
