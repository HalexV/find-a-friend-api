import { app } from '@/app';
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Adoption Requirements - Create Adoption Requirement (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an adoption requirement', async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .post('/adoption-requirements')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Needs Cold Weather',
      });

    expect(response.statusCode).toBe(201);
  });
});
