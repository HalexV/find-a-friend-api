import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { PetsRepository } from '@/repositories/pets-repository';
import { PhotosRepository } from '@/repositories/photos-repository';
import { PetComplete } from './fetch-pets-by-state-and-city';

interface GetPetUseCaseRequest {
  petId: string;
}

interface GetPetUseCaseResponse {
  pet: PetComplete;
}

export class GetPetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository
  ) {}

  async execute({
    petId,
  }: GetPetUseCaseRequest): Promise<GetPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    const photos = await this.photosRepository.findManyByPetId(pet.id);

    const completedPet = Object.assign({}, pet, {
      photos: photos.map((photo) => photo.url),
    });

    return {
      pet: completedPet,
    };
  }
}
