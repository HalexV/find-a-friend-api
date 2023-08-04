import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { registerPet } from './register-pet';
import { fetchPetsByStateAndCity } from './fetch-pets-by-state-and-city';
import { getPet } from './get-pet';

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:state/:city', fetchPetsByStateAndCity);
  app.get('/pets/:id', getPet);

  app.post('/pets', { onRequest: [verifyJWT] }, registerPet);
}
