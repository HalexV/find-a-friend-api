import { Org, Prisma } from '@prisma/client';

export interface OrgsRepository {
  create(data: Prisma.OrgCreateInput): Promise<Org>;
  findByEmail(email: string): Promise<Org | null>;
  findById(id: string): Promise<Org | null>;
  findManyByCity(city: string): Promise<Org[]>;
}
