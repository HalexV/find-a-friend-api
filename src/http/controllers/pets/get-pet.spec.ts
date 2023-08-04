import { app } from '@/app';
import { createPets } from '@/utils/test/create-pets';
import { emptyBucket } from '@/utils/test/emptyBucket';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Pets - Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    await createPets(app);
  });

  afterAll(async () => {
    await emptyBucket('photos');
    await app.close();
  });

  it('should be able to get a pet', async () => {
    const responseFetchPets = await request(app.server)
      .get('/pets/RO/colorado')
      .query({
        age: 'PUPPY',
      });

    const petId = responseFetchPets.body.pets[0].id;

    const response = await request(app.server).get(`/pets/${petId}`);

    const expectedResponse = {
      about: 'any',
      adoption_requirements: [],
      age: 'PUPPY',
      ambience: 'MEDIUM',
      energy_level: 'AVERAGE',
      id: expect.any(String),
      independence_level: 'HIGH',
      name: 'Mark',
      photos: [expect.any(String), expect.any(String)],
      size: 'MEDIUM',
      type: 'DOG',
      org: {
        address: 'Avenida das nações nº 4040',
        cep: '99999000',
        city: 'colorado',
        email: 'orgcolorado@org.com',
        latitude: '-12.7569858',
        longitude: '-60.1626287',
        name: 'Org Adote',
        responsible_name: 'John Doe',
        state: 'RO',
        whatsapp_number: '+55099911223344',
      },
    };

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
});
