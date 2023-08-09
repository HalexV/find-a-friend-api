import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCreateAdoptionRequirementUseCase } from '@/use-cases/factories/make-create-adoption-requirement-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function createAdoptionRequirement(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createAdoptionRequirementBodySchema = z.object({
    title: z.string(),
  });

  const { title } = createAdoptionRequirementBodySchema.parse(request.body);

  const createAdoptionRequirementUseCase =
    makeCreateAdoptionRequirementUseCase();

  await createAdoptionRequirementUseCase.execute({
    title,
    orgId: request.user.sub,
  });

  return reply.status(201).send();
}
