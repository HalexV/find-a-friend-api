import { ExceededAmountFileError } from '@/use-cases/errors/exceeded-amount-files-error';
import { ExceededSizeFileError } from '@/use-cases/errors/exceeded-size-file-error';
import { InvalidImageTypeError } from '@/use-cases/errors/invalid-image-type-error';
import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case';
import { makeRegisterPhotoUseCase } from '@/use-cases/factories/make-register-photo-use-case';
import { makeRemovePetUseCase } from '@/use-cases/factories/make-remove-pet-use-case';
import { makeRemovePhotoUseCase } from '@/use-cases/factories/make-remove-photo-use-case';
import { limitFileStreamSize } from '@/utils/limitFileStreamSize';
import { Photo } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { z } from 'zod';

export async function registerPet(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const orgId = request.user.sub;
  const registerPetBodySchema = z.object({
    about: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'ELDERLY']),
    ambience: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    available: z.coerce.boolean(),
    energyLevel: z.enum(['VERY_LOW', 'LOW', 'AVERAGE', 'HIGH', 'VERY_HIGH']),
    independenceLevel: z.enum(['LOW', 'AVERAGE', 'HIGH']),
    name: z.string(),
    size: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    type: z.enum(['CAT', 'DOG']),
    adoptionRequirementsIds: z.preprocess((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;

      return [value];
    }, z.array(z.string())),
  });

  const registerPetUseCase = makeRegisterPetUseCase();
  const registerPhotoUseCase = makeRegisterPhotoUseCase();
  const removePhotoUseCase = makeRemovePhotoUseCase();
  const removePetUseCase = makeRemovePetUseCase();

  function registerPhoto(stream: AsyncGenerator) {
    return registerPhotoUseCase.execute({
      petId,
      photo: { file: Readable.from(stream), type: 'JPEG' },
    });
  }

  const fields = {};
  const parts = request.parts();
  const MAX_PHOTO_FILES = 6;
  const MAX_PHOTO_SIZE = 400 * 1024;
  let photosCount = 0;
  let isPetCreated = false;
  let petId = '';
  const photoIds = [];

  try {
    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.mimetype !== 'image/jpeg') throw new InvalidImageTypeError();

        photosCount += 1;

        if (photosCount > MAX_PHOTO_FILES) {
          throw new ExceededAmountFileError();
        }

        if (!isPetCreated) {
          const {
            about,
            age,
            ambience,
            adoptionRequirementsIds,
            available,
            energyLevel,
            independenceLevel,
            name,
            size,
            type,
          } = registerPetBodySchema.parse(fields);

          const { pet } = await registerPetUseCase.execute({
            about,
            age,
            ambience,
            adoptionRequirementsIds,
            available,
            energyLevel,
            independenceLevel,
            name,
            orgId,
            size,
            type,
          });

          petId = pet.id;
          isPetCreated = true;
        }

        const { photo } = (await pipeline(
          part.file,
          limitFileStreamSize(MAX_PHOTO_SIZE),
          registerPhoto as any
        )) as { photo: Photo };

        photoIds.push(photo.id);
      } else {
        if (Reflect.has(fields, part.fieldname)) {
          const fieldValue = Reflect.get(fields, part.fieldname);

          if (Array.isArray(fieldValue)) {
            fieldValue.push(part.value);
          } else {
            const arr = [];

            arr.push(fieldValue);
            arr.push(part.value);

            Reflect.set(fields, part.fieldname, arr);
          }
        } else {
          Reflect.defineProperty(fields, part.fieldname, {
            value: part.value,
            enumerable: true,
            writable: true,
          });
        }
      }
    }

    return reply.status(201).send();
  } catch (error) {
    if (isPetCreated) {
      for (const id of photoIds) {
        await removePhotoUseCase.execute({ photoId: id });
      }

      await removePetUseCase.execute({ petId });
    }

    if (error instanceof InvalidImageTypeError) {
      return reply.status(400).send({ message: error.message });
    }

    if (error instanceof ExceededAmountFileError) {
      return reply.status(400).send({
        message: `${error.message} Max amount is ${MAX_PHOTO_FILES}`,
      });
    }

    if (error instanceof ExceededSizeFileError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
