import { z } from 'zod';
import { password } from './password';

export const signup = z
	.object({
		email: z.string().email({ message: "Inserisci un'email valida" }),
		password: password,
		confirmPassword: z.string(),
		name: z.string().min(2, { message: 'Il nome utente è obbligatorio per creare un account' }),
		phoneNumber: z.string().min(5, { message: 'Il numero di telefono è obbligatorio' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Le password non corrispondono',
		path: ['confirmPassword']
	});
export type FormSchema = typeof signup;
