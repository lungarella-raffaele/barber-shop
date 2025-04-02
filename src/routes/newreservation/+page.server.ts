import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { reservation } from '$lib/schemas/reservation.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import {
	getReservations as getReservations,
	insertReservation
} from '$lib/server/backend/reservation.js';
import { getAllServices } from '$lib/server/backend/services.js';
import { logger } from '$lib/server/logger.js';
import { getClosures } from '$lib/server/backend/closures-service.js';
import { newReservationEmail } from '$lib/emails/new-reservation.email.js';
import { BASE_URL } from '$env/static/private';
import { DAY_IN_MS } from '$lib/constants.js';

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
			const response = await insertReservation({
				date,
				hour,
				id: crypto.randomUUID(),
				serviceID: service,
				name: user.name,
				email: user.email,
				pending: false,
				expiresAt: new Date()
			});

			if (response) {
				return {
					newReservation: response
				};
			} else {
				return fail(500);
			}
		} else if (name && email) {
			// No auth user

			const response = await insertReservation({
				date,
				hour,
				id: crypto.randomUUID(),
				serviceID: service,
				name,
				email,
				expiresAt: new Date(Date.now() + DAY_IN_MS),
				pending: true
			});
			if (!response) {
				return fail(500);
			}

			const { error } = await newReservationEmail(
				name,
				email,
				`${BASE_URL}?reservation=${response.id}`
			);

			if (error) {
				return fail(500);
			}

			return {
				emailSent: true
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
