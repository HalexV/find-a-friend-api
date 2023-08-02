import { Prisma, Org, State } from '@prisma/client';
import { OrgsRepository } from '../orgs-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = [];

  async create(data: Prisma.OrgCreateInput) {
    const createdAt = new Date();

    const org = {
      id: randomUUID(),
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      cep: data.cep,
      state: data.state,
      city: data.city,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      name: data.name,
      responsible_name: data.responsible_name,
      whatsapp_number: data.whatsapp_number,
      created_at: createdAt,
      updated_at: createdAt,
    };

    this.items.push(org);

    return org;
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email);

    if (!org) return null;

    return org;
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id);

    if (!org) return null;

    return org;
  }

  async findManyByStateAndCity(data: { city: string; state: State }) {
    const orgs = this.items.filter(
      (org) => org.city === data.city && org.state === data.state
    );

    return orgs;
  }
}
