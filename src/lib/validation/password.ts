import { z } from 'zod';
export const passwordSchema = z
	.string()
	.min(8, { message: 'Troppo corto' })
	.max(20, { message: 'Troppo lungo' })
	.refine((password) => /[A-Z]/.test(password), {
		message: 'Almeno un elemento uppercase'
	})
	.refine((password) => /[a-z]/.test(password), {
		message: 'Alemno un elemento lowercase'
	})
	.refine((password) => /[0-9]/.test(password), { message: 'Almeno un numero' })
	.refine((password) => /[!@#$%^&*]/.test(password), {
		message: 'Almeno un carattere speciale'
	});
