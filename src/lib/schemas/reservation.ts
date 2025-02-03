import { z } from 'zod';

export const reservation = z.object({
	name: z.string(),
	surname: z.string(),
	email: z.string().email(),
	date: z.string(),
	slot: z.string(),
	service: z.string()
});

export type FormSchema = typeof reservation;
