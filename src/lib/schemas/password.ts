import { z } from 'zod';
export const password = z
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

export const confirmPassword = z.string().refine((confirmPassword) => confirmPassword, {
	message: 'Le password non coincidono'
});
