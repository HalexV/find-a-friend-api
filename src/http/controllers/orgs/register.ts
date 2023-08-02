import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    address: z.string(),
    cep: z.string().length(8),
    city: z.string().max(256).toLowerCase(),
    state: z.enum([
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ]),
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
    state,
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
      state,
      email,
      latitude,
      longitude,
      name,
      password,
      responsible_name: responsibleName,
      whatsapp_number: whatsappNumber,
    });
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send();
    }

    throw error;
  }

  return reply.status(201).send();
}
