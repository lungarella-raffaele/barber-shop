import { z } from 'zod';
import { passwordSchema } from './password';

export const registerSchema = z.object({
	email: z.string().email(),
	password: passwordSchema,
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string()
});

export type FormSchema = typeof registerSchema;
