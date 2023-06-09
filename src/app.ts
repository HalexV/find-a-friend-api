import fastify from 'fastify';
import { orgRoutes } from './http/controllers/orgs/routes';

export const app = fastify();

app.register(orgRoutes);
