import { app } from '@/app';
import { createAdoptionRequirement } from '@/utils/test/create-adoption-requirement';
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org';
import { emptyBucket } from '@/utils/test/emptyBucket';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const basePath = join(__dirname, '../../../utils/test/images');

describe('Pets - Register Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await emptyBucket('photos');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register a pet', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app);
    const { adoptionRequirementId } = await createAdoptionRequirement(
      orgId,
      'Need Cold Weather'
    );

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
        adoptionRequirementsIds: [adoptionRequirementId],
        age: 'PUPPY',
        ambience: 'MEDIUM',
        available: true,
        energyLevel: 'AVERAGE',
        independenceLevel: 'HIGH',
        name: 'Mark',
        orgId,
        size: 'MEDIUM',
        type: 'DOG',
      })
      .attach('photos', `${basePath}/image1.jpg`)
      .attach('photos', `${basePath}/image2.jpg`);
    expect(response.statusCode).toBe(201);
  });
});
