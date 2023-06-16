import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { registerPet } from './register-pet';

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJWT] }, registerPet);
}
