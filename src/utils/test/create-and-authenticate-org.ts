import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
    address: 'Avenida das nações nº 4040',
    cep: '99999000',
    city: 'Colorado',
    email: 'org@org.com',
    latitude: -12.7569858,
    longitude: -60.1626287,
    name: 'Org Adote',
    password: '12345678',
    responsibleName: 'John Doe',
    whatsappNumber: '+55099911223344',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'org@org.com',
    password: '12345678',
  });

  const { token } = authResponse.body;

  return { token };
}
