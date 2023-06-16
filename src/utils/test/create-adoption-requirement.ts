import { prisma } from '@/lib/prisma';

export async function createAdoptionRequirement(orgId: string, title: string) {
  const { id: adoptionRequirementId } = await prisma.adoptionRequirement.create(
    {
      data: {
        title,
        org_id: orgId,
      },
    }
  );

  return { adoptionRequirementId };
}
