import { InvalidImageTypeError } from '@/use-cases/errors/invalid-image-type-error';
import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case';
import { makeRegisterPhotoUseCase } from '@/use-cases/factories/make-register-photo-use-case';
import { makeRemovePetUseCase } from '@/use-cases/factories/make-remove-pet-use-case';
import { makeRemovePhotoUseCase } from '@/use-cases/factories/make-remove-photo-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
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
      if (Array.isArray(value)) return value;

      return [value];
    }, z.array(z.string())),
  });

  const registerPetUseCase = makeRegisterPetUseCase();
  const registerPhotoUseCase = makeRegisterPhotoUseCase();
  const removePhotoUseCase = makeRemovePhotoUseCase();
  const removePetUseCase = makeRemovePetUseCase();

  const fields = {};
  const parts = request.parts();
  let isPetCreated = false;
  let petId = '';
  const photoIds = [];

  try {
    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.mimetype !== 'image/jpeg') throw new InvalidImageTypeError();

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

        const { photo } = await registerPhotoUseCase.execute({
          petId,
          photo: { file: part.file, type: 'JPEG' },
        });

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

    throw error;
  }
}
