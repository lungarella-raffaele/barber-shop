import { z } from 'zod';

export const reservation = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	date: z.string().date(),
	hour: z.string().nonempty(),
	service: z.string().nonempty()
});

export type FormSchema = typeof reservation;
