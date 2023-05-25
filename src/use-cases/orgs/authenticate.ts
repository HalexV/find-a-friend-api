import { OrgsRepository } from '@/repositories/orgs-repository';
import { Org } from '@prisma/client';

import argon2 from 'argon2';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  org: Org;
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await argon2.verify(org.password_hash, password);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      org,
    };
  }
}
