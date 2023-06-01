import { Prisma, Org, AdoptionRequirement } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AdoptionRequirementsRepository } from '../adoption-requirements-repository';

export class InMemoryAdoptionRequirementsRepository
  implements AdoptionRequirementsRepository
{
  public items: AdoptionRequirement[] = [];

  async create(data: Prisma.AdoptionRequirementUncheckedCreateInput) {
    const createdAt = new Date();

    const adoptionRequirement = {
      id: randomUUID(),
      org_id: data.org_id,
      title: data.title,
      created_at: createdAt,
      updated_at: createdAt,
    };

    this.items.push(adoptionRequirement);

    return adoptionRequirement;
  }

  async findById(id: string) {
    const adoptionRequirement = this.items.find((item) => item.id === id);

    if (!adoptionRequirement) return null;

    return adoptionRequirement;
  }
}
