import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { registerPet } from './register-pet';
import { fetchPetsByStateAndCity } from './fetch-pets-by-state-and-city';

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:state/:city', fetchPetsByStateAndCity);
  app.post('/pets', { onRequest: [verifyJWT] }, registerPet);
}
