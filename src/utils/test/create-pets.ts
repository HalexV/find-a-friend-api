import { FastifyInstance } from 'fastify';
import { join } from 'node:path';
import request from 'supertest';

const basePath = join(__dirname, '../../utils/test/images');

async function createAndAuthenticateOrgColorado(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
    address: 'Avenida das nações nº 4040',
    cep: '99999000',
    city: 'Colorado',
    state: 'RO',
    email: 'orgcolorado@org.com',
    latitude: -12.7569858,
    longitude: -60.1626287,
    name: 'Org Adote',
    password: '12345678',
    responsibleName: 'John Doe',
    whatsappNumber: '+55099911223344',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'orgcolorado@org.com',
    password: '12345678',
  });

  const { token } = authResponse.body;

  return { token };
}

async function createAndAuthenticateOrgVilhena(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
    address: 'Avenida das nações nº 4040',
    cep: '99999000',
    city: 'Vilhena',
    state: 'RO',
    email: 'orgvilhena@org.com',
    latitude: -12.7569858,
    longitude: -60.1626287,
    name: 'Org Adote',
    password: '12345678',
    responsibleName: 'John Doe',
    whatsappNumber: '+55099911223344',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'orgvilhena@org.com',
    password: '12345678',
  });

  const { token } = authResponse.body;

  return { token };
}

async function createPetsColorado(app: FastifyInstance, token: string) {
  const petMark = request(app.server)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .field({
      about: 'any',
      adoptionRequirementsIds: [],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'AVERAGE',
      independenceLevel: 'HIGH',
      name: 'Mark',
      size: 'MEDIUM',
      type: 'DOG',
    })
    .attach('photos', `${basePath}/image1.jpg`)
    .attach('photos', `${basePath}/image2.jpg`);

  const petCharles = request(app.server)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .field({
      about: 'any',
      adoptionRequirementsIds: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'AVERAGE',
      independenceLevel: 'HIGH',
      name: 'Charles',
      size: 'MEDIUM',
      type: 'DOG',
    })
    .attach('photos', `${basePath}/image1.jpg`)
    .attach('photos', `${basePath}/image2.jpg`);

  const petMartin = request(app.server)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .field({
      about: 'any',
      adoptionRequirementsIds: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'LOW',
      independenceLevel: 'AVERAGE',
      name: 'Martin',
      size: 'SMALL',
      type: 'CAT',
    })
    .attach('photos', `${basePath}/image1.jpg`)
    .attach('photos', `${basePath}/image2.jpg`);

  await Promise.all([petMark, petCharles, petMartin]);
}

async function createPetsVilhena(app: FastifyInstance, token: string) {
  const petCarlitos = request(app.server)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .field({
      about: 'any',
      adoptionRequirementsIds: [],
      age: 'ADULT',
      ambience: 'MEDIUM',
      available: true,
      energyLevel: 'AVERAGE',
      independenceLevel: 'HIGH',
      name: 'Carlitos',
      size: 'BIG',
      type: 'CAT',
    })
    .attach('photos', `${basePath}/image1.jpg`)
    .attach('photos', `${basePath}/image2.jpg`);

  await Promise.all([petCarlitos]);
}

export async function createPets(app: FastifyInstance) {
  const [{ token: tokenColorado }, { token: tokenVilhena }] = await Promise.all(
    [
      createAndAuthenticateOrgColorado(app),
      createAndAuthenticateOrgVilhena(app),
    ]
  );

  await Promise.all([
    createPetsColorado(app, tokenColorado),
    createPetsVilhena(app, tokenVilhena),
  ]);
}
