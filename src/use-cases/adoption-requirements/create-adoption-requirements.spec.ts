import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { CreateAdoptionRequirementUseCase } from './create-adoption-requirement';
import { InMemoryAdoptionRequirementsRepository } from '@/repositories/in-memory/in-memory-adoption-requirements-repository';

import argon2 from 'argon2';

let adoptionRequirementsRepository: InMemoryAdoptionRequirementsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: CreateAdoptionRequirementUseCase;

describe('Adoption Requirements - Create Use Case', () => {
  beforeEach(() => {
    adoptionRequirementsRepository =
      new InMemoryAdoptionRequirementsRepository();
    orgsRepository = new InMemoryOrgsRepository();
    sut = new CreateAdoptionRequirementUseCase(
      adoptionRequirementsRepository,
      orgsRepository
    );
  });

  it('should be able to create an adoption requirement', async () => {
    const org = await orgsRepository.create({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password_hash: await argon2.hash('12345678'),
      responsible_name: 'John Doe',
      whatsapp_number: '+55099911223344',
    });

    const { adoptionRequirement } = await sut.execute({
      orgId: org.id,
      title: 'Cachorro peludo precisa de ambiente frio.',
    });

    expect(adoptionRequirement.id).toEqual(expect.any(String));
    expect(adoptionRequirement.org_id).toEqual(org.id);
    expect(adoptionRequirement.title).toEqual(
      'Cachorro peludo precisa de ambiente frio.'
    );
  });
});
