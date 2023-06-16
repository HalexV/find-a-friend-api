import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';

import { orgRoutes } from './http/controllers/orgs/routes';
import { ZodError } from 'zod';
import { env } from './env';
import { adoptionRequirementsRoutes } from './http/controllers/adoption-requirements/routes';
import { petsRoutes } from './http/controllers/pets/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(fastifyMultipart);

app.register(orgRoutes);
app.register(adoptionRequirementsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  });
});
