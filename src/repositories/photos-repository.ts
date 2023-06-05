import { Photo } from '@prisma/client';
import { Readable } from 'stream';

export interface PhotoCreateInput {
  petId: string;
  file: Readable;
}

export interface PhotosRepository {
  create(data: PhotoCreateInput): Promise<Photo>;
}
