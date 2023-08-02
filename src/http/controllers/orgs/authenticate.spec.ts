import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Orgs - Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/orgs').send({
      address: 'Avenida das nações nº 4040',
      cep: '99999000',
      city: 'Colorado',
      state: 'RO',
      email: 'org@org.com',
      latitude: -12.7569858,
      longitude: -60.1626287,
      name: 'Org Adote',
      password: '12345678',
      responsibleName: 'John Doe',
      whatsappNumber: '+55099911223344',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'org@org.com',
      password: '12345678',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
