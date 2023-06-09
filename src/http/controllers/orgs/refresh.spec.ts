import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Orgs - Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
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

    const cookies = authResponse.get('Set-Cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
