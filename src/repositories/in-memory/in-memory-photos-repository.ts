import { Photo } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PhotoCreateInput, PhotosRepository } from '../photos-repository';

export class InMemoryPhotosRepository implements PhotosRepository {
  public items: Photo[] = [];

  async create(data: PhotoCreateInput) {
    const createdAt = new Date();
    const id = randomUUID();

    for await (const chunk of data.file) {
    }

    const photo: Photo = {
      id,
      pet_id: data.petId,
      url: `inmemory://${id}`,
      created_at: createdAt,
      updated_at: createdAt,
    };

    this.items.push(photo);

    return photo;
  }

  async findById(id: string) {
    const photo = this.items.find((item) => item.id === id);

    if (!photo) return null;

    return photo;
  }

  async findManyByPetId(id: string) {
    const photos = this.items.filter((photo) => photo.pet_id === id);

    return photos;
  }

  async delete(id: string) {
    const photoIndex = this.items.findIndex((photo) => photo.id === id);

    this.items.splice(photoIndex, 1);
  }
}
