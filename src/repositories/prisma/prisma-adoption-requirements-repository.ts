import { Prisma, AdoptionRequirement } from '@prisma/client';
import { AdoptionRequirementsRepository } from '../adoption-requirements-repository';
import { prisma } from '@/lib/prisma';

export class PrismaAdoptionRequirementsRepository
  implements AdoptionRequirementsRepository
{
  async create(data: Prisma.AdoptionRequirementUncheckedCreateInput) {
    const adoptionRequirement = await prisma.adoptionRequirement.create({
      data: {
        title: data.title,
        org_id: data.org_id,
      },
    });

    return adoptionRequirement;
  }

  async findById(id: string): Promise<AdoptionRequirement | null> {
    return await prisma.adoptionRequirement.findFirst({ where: { id } });
  }
}
