import { BASE_URL } from '$env/static/private';
import { LOCK_EXPIRATION_MINUTES } from '$lib/constants.js';
import { newReservationEmail } from '$lib/emails/new-reservation.email.js';
import { reservation } from '$lib/schemas/reservation.js';
import { getClosures } from '$lib/server/backend/closures-service.js';
import {
	deleteReservation,
	getReservations,
	insertReservation
} from '$lib/server/backend/reservation.js';
import { getAllServices } from '$lib/server/backend/services.js';
import { logger } from '$lib/server/logger.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = locals.user;
		const data = await request.formData();

		const date = data.get('date') as string;
		const hour = data.get('hour') as string;
		const name = data.get('name') as string;
		const email = data.get('email') as string;

		if (!date || !hour) {
			return fail(404, {
				step: 'date',
				message: 'Devi inserire una data per la prenotazione'
			});
		}

		const service = data.get('service') as string;
		if (!service) {
			return fail(404, {
				step: 'service',
				message: 'Devi inserire un servizio per poter proseguire'
			});
		}

		// No info provided for the user
		if ((!name || !email) && !user) {
			return fail(404, {
				message: 'Non è stato possibile effettuare una prenotazione con i dati inseriti'
			});
		}

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
				name: user.name,
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
			// No auth user
			const response = await insertReservation({
				date,
				hour,
				id: crypto.randomUUID(),
				serviceID: service,
				name,
				email,
				expiresAt: new Date(Date.now() + LOCK_EXPIRATION_MINUTES),
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
				response.value.date,
				response.value.hour
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
		form: await superValidate(zod(reservation)),
		title: 'Nuova prenotazione | '
	};
};
