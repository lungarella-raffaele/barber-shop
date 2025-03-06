import { z } from 'zod';

export const login = z.object({
	email: z.string().email({ message: 'Inserisci una mail valida' }),
	password: z.string().min(1, { message: 'La password non può essere vuota' })
});

export type FormSchema = typeof login;
