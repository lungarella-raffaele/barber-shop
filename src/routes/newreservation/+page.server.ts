import { BASE_URL } from '$env/static/private';
import { LOCK_DURATION } from '$lib/constants.js';
import { newReservationEmail } from '$lib/emails/new-reservation.email.js';
import { reservation } from '$lib/schemas/reservation';
import { logger } from '$lib/server/logger.js';
import { formatDate, formatTime, getString } from '$lib/utils.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { ReservationService } from '@services/reservation.service.js';
import { KindService } from '@services/kind.service.js';
import { ShutdownService } from '@services/shutdown.service.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const reservationService = new ReservationService();
		const user = locals.user;
		const data = await request.formData();

		const date = getString(data, 'date');
		const hour = getString(data, 'hour');
		const kindID = getString(data, 'service');

		const name = getString(data, 'name');
		const email = getString(data, 'email');
		const phoneNumber = getString(data, 'phone');

		if (user) {
			// Logged in user
			const schema = reservation.safeParse({
				name: user.name,
				hour,
				service: kindID,
				email: user.email,
				date
			});

			if (!schema.success) {
				const { path } = schema.error.issues[0];
				logger.warn({ reason: path }, 'Could not create reservation');

				if (path.includes('date') || path.includes('hour')) {
					return fail(400, {
						step: 'date',
						message: 'Devi scegliere una data per la prenotazione.'
					});
				} else if (path.includes('service')) {
					return fail(400, {
						step: 'service',
						message: 'Devi scegliere un servizio per poter proseguire.'
					});
				} else if ((path.includes('email') || path.includes('name')) && !user) {
					return fail(400, {
						step: 'info',
						message: 'Devi inserire un nome e una mail valida.'
					});
				} else {
					return fail(400);
				}
			}

			logger.info('Creating reservation with existing user');
			const expiresAt = new Date(date);
			expiresAt.setDate(expiresAt.getDate() + 1); // Add one day
			expiresAt.setHours(23, 59, 59, 999); // Set to end of the day

			const response = await reservationService.insert({
				date,
				hour,
				id: crypto.randomUUID(),
				kindID,
				name: user.isAdmin ? name : user.name,
				phoneNumber: user.phoneNumber,
				email: user.email,
				pending: false,
				expiresAt
			});

			if (!response.ok) {
				if (response.error === 'conflict') {
					return fail(409);
				} else {
					return fail(500);
				}
			}

			return {
				newReservation: response.value
			};
		} else if (name && email) {
			const schema = reservation.safeParse({
				name,
				hour,
				service: kindID,
				email,
				date
			});

			if (!schema.success) {
				const { path } = schema.error.issues[0];
				logger.warn({ reason: path }, 'Could not create reservation');

				if (path.includes('date') || path.includes('hour')) {
					return fail(400, {
						step: 'date',
						message: 'Devi scegliere una data per la prenotazione.'
					});
				} else if (path.includes('service')) {
					return fail(400, {
						step: 'service',
						message: 'Devi scegliere un servizio per poter proseguire.'
					});
				} else if ((path.includes('email') || path.includes('name')) && !user) {
					return fail(400, {
						step: 'info',
						message: 'Devi inserire un nome e una mail valida.'
					});
				} else {
					return fail(400);
				}
			}
			// No auth user
			const response = await reservationService.insert({
				date,
				hour,
				id: crypto.randomUUID(),
				kindID,
				name,
				email,
				phoneNumber,
				expiresAt: new Date(Date.now() + LOCK_DURATION),
				pending: true
			});
			if (!response.ok) {
				if (response.error === 'conflict') {
					return fail(409);
				}
				return fail(500);
			}

			const { error } = await newReservationEmail(
				name,
				email,
				`${BASE_URL}?reservation=${response.value.id}`,
				formatDate(response.value.date),
				formatTime(response.value.hour)
			);

			if (error) {
				reservationService.delete(response.value.id);
				return fail(500);
			}

			return {
				pending: true,
				newReservation: response.value
			};
		} else {
			return fail(500);
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const kind = new KindService();
	const reservationService = new ReservationService();
	const shutdowns = new ShutdownService();

	const kinds = await kind.getAll();
	const currentReservations = await reservationService.get();

	const closures = await shutdowns.getAll();

	return {
		currentReservations,
		closures,
		kinds,
		user: locals.user,
		title: 'Nuova prenotazione | '
	};
};
