import { OrgsRepository } from '@/repositories/orgs-repository';
import { Org } from '@prisma/client';
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error';

import argon2 from 'argon2';

interface RegisterUseCaseRequest {
  address: string;
  cep: string;
  city: string;
  email: string;
  latitude: number;
  longitude: number;
  name: string;
  password: string;
  responsible_name: string;
  whatsapp_number: string;
}

interface RegisterUseCaseResponse {
  org: Org;
}

export class RegisterUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    address,
    cep,
    city,
    email,
    latitude,
    longitude,
    name,
    password,
    responsible_name,
    whatsapp_number,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const orgAlreadyCreated = await this.orgsRepository.findByEmail(email);

    if (orgAlreadyCreated) {
      throw new OrgAlreadyExistsError();
    }

    const password_hash = await argon2.hash(password);

    const org = await this.orgsRepository.create({
      address,
      cep,
      city: city.toLocaleLowerCase(),
      email,
      latitude,
      longitude,
      name,
      password_hash,
      responsible_name,
      whatsapp_number,
    });

    return {
      org,
    };
  }
}
