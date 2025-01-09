import { z } from 'zod';
import { password } from './password';

export const signup = z.object({
	email: z.string().email(),
	password: password,
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string()
});

export type FormSchema = typeof signup;
