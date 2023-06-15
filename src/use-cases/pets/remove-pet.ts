import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { PetsRepository } from '@/repositories/pets-repository';

interface RemovePetUseCaseRequest {
  petId: string;
}

export class RemovePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: RemovePetUseCaseRequest): Promise<void> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    await this.petsRepository.delete(petId);
  }
}
