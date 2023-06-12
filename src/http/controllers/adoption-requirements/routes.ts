import { FastifyInstance } from 'fastify';
import { createAdoptionRequirement } from './create-adoption-requirement';
import { verifyJWT } from '@/http/middlewares/verify-jwt';

export async function adoptionRequirementsRoutes(app: FastifyInstance) {
  app.post(
    '/adoption-requirements',
    { onRequest: [verifyJWT] },
    createAdoptionRequirement
  );
}
