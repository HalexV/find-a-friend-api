import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeGetOrgUseCase } from '@/use-cases/factories/make-get-org-use-case';
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });

  const { id: petId } = requestParamsSchema.parse(request.params);

  const getPetUseCase = makeGetPetUseCase();
  const getOrgUseCase = makeGetOrgUseCase();

  try {
    const {
      pet: {
        about,
        adoption_requirements,
        age,
        ambience,
        energy_level,
        id,
        independence_level,
        name,
        photos,
        size,
        type,
        org_id,
      },
    } = await getPetUseCase.execute({ petId });

    const {
      org: {
        address,
        cep,
        city,
        email,
        latitude,
        longitude,
        name: orgName,
        responsible_name,
        state,
        whatsapp_number,
      },
    } = await getOrgUseCase.execute({ orgId: org_id });

    const responseData = {
      about,
      adoption_requirements,
      age,
      ambience,
      energy_level,
      id,
      independence_level,
      name,
      photos,
      size,
      type,
      org: {
        address,
        cep,
        city,
        email,
        latitude,
        longitude,
        name: orgName,
        responsible_name,
        state,
        whatsapp_number,
      },
    };

    return reply.send(responseData);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
