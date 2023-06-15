import { Photo } from '@prisma/client';
import { Readable } from 'stream';

export interface PhotoCreateInput {
  petId: string;
  file: Readable;
}

export interface PhotosRepository {
  create(data: PhotoCreateInput): Promise<Photo>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Photo | null>;
  findManyByPetId(id: string): Promise<Photo[]>;
}
