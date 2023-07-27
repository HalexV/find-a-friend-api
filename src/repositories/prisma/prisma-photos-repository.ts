import { Photo } from '@prisma/client';
import { PhotoCreateInput, PhotosRepository } from '../photos-repository';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { s3Client } from '@/lib/s3Client';
import { Upload } from '@aws-sdk/lib-storage';
import { prisma } from '@/lib/prisma';

export class PrismaPhotosRepository implements PhotosRepository {
  async create(data: PhotoCreateInput): Promise<Photo> {
    const objectKey = `${randomUUID()}.jpeg`;

    const params = {
      Bucket: 'photos',
      Key: objectKey,
      Body: data.file,
    };

    const objectUrl = `http://localhost:9090/photos/${objectKey}`;

    await new Upload({
      client: s3Client,
      params,
    }).done();

    const photo = await prisma.photo.create({
      data: {
        url: objectUrl,
        pet_id: data.petId,
      },
    });

    return photo;
  }

  async delete(id: string): Promise<void> {
    const photo = await prisma.photo.delete({ where: { id } });

    const match = photo.url.match(/photos\/(?<key>[\w-]+\.jpeg)/);
    if (!match) throw new Error('Not matched');
    if (!match.groups) throw new Error('Not groups matched');

    const photoKey = match.groups.key;

    const params: DeleteObjectCommandInput = {
      Bucket: 'photos',
      Key: photoKey,
    };

    await s3Client.send(new DeleteObjectCommand(params));
  }

  async findById(id: string): Promise<Photo | null> {
    return await prisma.photo.findFirst({ where: { id } });
  }

  async findManyByPetId(id: string): Promise<Photo[]> {
    return await prisma.photo.findMany({ where: { pet_id: id } });
  }
}
