import { z } from 'zod';

export const emailSchema = z.object({
	email: z.string().email({ message: 'Inserisci una mail valida' })
});

export const loginSchema = z.object({
	email: z.string().email({ message: 'Inserisci una mail valida' }),
	password: z.string().min(1, { message: 'La password non può essere vuota' })
});

export const passwordSchema = z
	.string()
	.min(8, { message: 'Minimo 8 caratteri' })
	.max(20, { message: 'Massimo 20 caratteri' })
	.refine((password) => /[A-Z]/.test(password), {
		message: 'Un elemento uppercase'
	})
	.refine((password) => /[a-z]/.test(password), {
		message: 'Un elemento lowercase'
	})
	.refine((password) => /[0-9]/.test(password), { message: 'Almeno un numero' })
	.refine((password) => /[!@#$%^&*]/.test(password), {
		message: 'Un carattere speciale'
	});

export const confirmPasswordSchema = z.string().refine((confirmPassword) => confirmPassword, {
	message: 'Le password non coincidono'
});

export const newPasswordSchema = z.object({
	password: passwordSchema
});

export const reservationSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	date: z.string().date(),
	hour: z.string().nonempty(),
	kind: z.string().nonempty()
});

export const signupSchema = z
	.object({
		email: z.string().email({ message: "Inserisci un'email valida" }),
		password: passwordSchema,
		confirmPassword: z.string(),
		name: z.string().min(2, { message: 'Il nome utente è obbligatorio per creare un account' }),
		phoneNumber: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Le password non corrispondono',
		path: ['confirmPassword']
	});

export type ReservationSchema = typeof reservationSchema;
export type NewPasswordSchema = typeof newPasswordSchema;
export type LoginSchema = typeof loginSchema;
export type EmailSchema = typeof emailSchema;
export type FormSchema = typeof signupSchema;
