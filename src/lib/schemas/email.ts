import { z } from 'zod';

export const emailSchema = z.object({
	email: z.string().email({ message: 'Inserisci una mail valida' })
});

export type FormSchema = typeof emailSchema;
