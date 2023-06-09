import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    address: z.string(),
    cep: z.string().length(8),
    city: z.string().max(256).toLowerCase(),
    email: z.string().email(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
    name: z.string(),
    password: z.string().min(8),
    responsibleName: z.string(),
    whatsappNumber: z.string(),
  });

  const {
    address,
    cep,
    city,
    email,
    latitude,
    longitude,
    name,
    password,
    responsibleName,
    whatsappNumber,
  } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      address,
      cep,
      city,
      email,
      latitude,
      longitude,
      name,
      password,
      responsible_name: responsibleName,
      whatsapp_number: whatsappNumber,
    });
  } catch (error) {
    throw error;
  }

  return reply.status(201).send();
}
