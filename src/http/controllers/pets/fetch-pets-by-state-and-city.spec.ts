import { app } from '@/app';
import { createPets } from '@/utils/test/create-pets';
import { emptyBucket } from '@/utils/test/emptyBucket';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('Pets - Fetch Pets By State and City (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    await createPets(app);
  });

  afterEach(async () => {
    await emptyBucket('photos');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to fetch pets by state and city', async () => {
    const response = await request(app.server)
      .get('/pets/RO/colorado')
      .query({
        age: 'PUPPY',
        type: ['CAT', 'DOG'],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.pets[0].name).toBe('Mark');
  });
});
