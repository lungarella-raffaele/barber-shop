import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { reservation } from '$lib/schemas/reservation.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { insertReservation } from '$lib/server/backend/reservation-service.js';
import { getAllServices } from '$lib/server/backend/services-service.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const date = data.get('date') as string;
		const hour = data.get('hour') as string;

		if (!date || !hour) {
			return fail(404, { step: 'date', message: 'Devi inserire una data per la prenotazione' });
		}

		const service = data.get('service') as string;
		if (!service) {
			return fail(404, {
				step: 'service',
				message: 'Devi inserire un servizio per poter proseguire'
			});
		}

		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;

		if (!name || !surname || !email) {
			return fail(404, { step: 'info', message: 'Devi inserire i tuoi nominativi' });
		}

		if (!locals.user) {
			return fail(404, { message: 'Riprova' });
		} else {
			await insertReservation({
				date,
				id: crypto.randomUUID(),
				userID: locals.user.id,
				serviceID: service
			});
			return {
				bookingCreated: true
			};
		}
	}
};

export const load: PageServerLoad = async () => {
	const services = await getAllServices();
	return {
		services,
		form: await superValidate(zod(reservation)),
		title: 'Nuova prenotazione | '
	};
};
