import { PetComplete } from './register-pet';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { PetsRepository } from '@/repositories/pets-repository';

interface GetPetUseCaseRequest {
  petId: string;
}

interface GetPetUseCaseResponse {
  pets: PetComplete;
}

export class GetPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: GetPetUseCaseRequest): Promise<void> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }
  }
}
