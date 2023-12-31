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
        size: 'MEDIUM',
        type: 'DOG',
      })
      .attach('photos', `${basePath}/image1.jpg`)
      .attach('photos', `${basePath}/image2.jpg`);
    expect(response.statusCode).toBe(201);
  });

  it('should not be able to register a pet when some pet information is invalid', async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
        age: 'INVALID',
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
    expect(response.statusCode).toBe(400);
  });

  it('should not be able to register a pet when some photo is invalid', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app);
    const { adoptionRequirementId: adoptionRequirementId1 } =
      await createAdoptionRequirement(orgId, 'Need Cold Weather');
    const { adoptionRequirementId: adoptionRequirementId2 } =
      await createAdoptionRequirement(orgId, 'Require large yard');
    const { adoptionRequirementId: adoptionRequirementId3 } =
      await createAdoptionRequirement(orgId, 'Require large sofa');

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
        adoptionRequirementsIds: [
          adoptionRequirementId1,
          adoptionRequirementId2,
          adoptionRequirementId3,
        ],
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
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image1.png`);

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when photos are not the last fields', async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .attach('photos', `${basePath}/image1.jpg`)
      .field({
        about: 'any',
        age: 'PUPPY',
        ambience: 'MEDIUM',
        available: true,
        energyLevel: 'AVERAGE',
        independenceLevel: 'HIGH',
        name: 'Mark',
        size: 'MEDIUM',
        type: 'DOG',
      });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when quantity of photos sent is greater than six', async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
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
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image2.jpg`)
      .attach('photos', `${basePath}/image2.jpg`);

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when size of some photo is greater than 400 KB', async () => {
    const { token } = await createAndAuthenticateOrg(app);
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
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
      .attach('photos', `${basePath}/big-image.jpg`)
      .attach('photos', `${basePath}/image2.jpg`);

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when at least a photo is not sent', async () => {
    const { token } = await createAndAuthenticateOrg(app);
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .field({
        about: 'any',
        age: 'PUPPY',
        ambience: 'MEDIUM',
        available: true,
        energyLevel: 'AVERAGE',
        independenceLevel: 'HIGH',
        name: 'Mark',
        size: 'MEDIUM',
        type: 'DOG',
      });

    expect(response.statusCode).toBe(400);
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app.server).post('/pets').field({
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
    });
    expect(response.statusCode).toBe(401);
  });

  it.todo('should revert register when request is cancelled');
});
