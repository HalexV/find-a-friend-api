import { Prisma, Org, State } from '@prisma/client';
import { OrgsRepository } from '../orgs-repository';
import { prisma } from '@/lib/prisma';

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = await prisma.org.create({ data });

    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    return await prisma.org.findFirst({ where: { email } });
  }

  async findById(id: string): Promise<Org | null> {
    return await prisma.org.findFirst({ where: { id } });
  }

  async findManyByStateAndCity(data: {
    city: string;
    state: State;
  }): Promise<Org[]> {
    const { city, state } = data;
    return await prisma.org.findMany({ where: { city, state } });
  }
}
