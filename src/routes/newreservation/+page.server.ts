import { BASE_URL } from '$env/static/private';
import { LOCK_DURATION } from '$lib/constants.js';
import { newReservationEmail } from '$lib/emails/new-reservation.email.js';
import { reservation } from '$lib/schemas/reservation';
import { getClosures } from '$lib/server/backend/closures-service.js';
import {
	deleteReservation,
	getReservations,
	insertReservation
} from '$lib/server/backend/reservation.js';
import { getAllServices } from '$lib/server/backend/services.js';
import { logger } from '$lib/server/logger.js';
import { formatDate, formatTime } from '$lib/utils.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = locals.user;
		const data = await request.formData();

		const date = data.get('date') as string;
		const hour = data.get('hour') as string;
		const service = data.get('service') as string;

		const name = data.get('name') as string;
		const email = data.get('email') as string;

		if (user) {
			// Logged in user

			logger.info('Creating reservation with existing user');
			const expiresAt = new Date(date);
			expiresAt.setDate(expiresAt.getDate() + 1); // Add one day
			expiresAt.setHours(23, 59, 59, 999); // Set to end of the day
			const response = await insertReservation({
				date,
				hour,
				id: crypto.randomUUID(),
				serviceID: service,
				name: user.isAdmin ? name : user.name,
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
				service,
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
			const response = await insertReservation({
				date,
				hour,
				id: crypto.randomUUID(),
				serviceID: service,
				name,
				email,
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
				deleteReservation(response.value.id);
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
	const services = await getAllServices();
	const currentReservations = await getReservations();
	const closures = await getClosures();

	return {
		currentReservations,
		closures,
		services,
		user: locals.user,
		title: 'Nuova prenotazione | '
	};
};
