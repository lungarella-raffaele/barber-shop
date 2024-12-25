import { z } from 'zod';

export const bookSchema = z.object({
	name: z.string().min(2).max(50),
	surname: z.string().min(2).max(50),
	phoneNumber: z.string().min(9).max(9),
	email: z.string().email()
});

export type FormSchema = typeof bookSchema;
