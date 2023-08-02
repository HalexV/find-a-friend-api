import { Org, Prisma, State } from '@prisma/client';

export interface OrgsRepository {
  create(data: Prisma.OrgCreateInput): Promise<Org>;
  findByEmail(email: string): Promise<Org | null>;
  findById(id: string): Promise<Org | null>;
  findManyByStateAndCity(data: { city: string; state: State }): Promise<Org[]>;
}
