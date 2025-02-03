import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { reservation } from '$lib/schemas/reservation.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { insertReservation } from '$lib/server/backend/reservation-service.js';
import { getAllServices } from '$lib/server/backend/services-service.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const date = data.get('date') as string;
		const slot = data.get('slot') as string;

		if (!date || !slot) {
			return fail(404, { step: 'date', message: 'Devi inserire una data per la prenotazione' });
		}

		const service = data.get('service') as string;
		if (!service) {
			return fail(404, {
				step: 'service',
				message: 'Devi inserire un servizio per poter proseguire'
			});
		}

		if (!locals.user) {
			return redirect(307, '/');
		}

		const response = await insertReservation({
			date,
			slot,
			id: crypto.randomUUID(),
			userID: locals.user.id,
			serviceID: service
		});

		if (response) {
			return {
				success: true
			};
		} else {
			return fail(500, { success: false });
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const services = await getAllServices();
	if (!locals.user) {
		redirect(307, '/');
	}
	return {
		services,
		user: locals.user,
		form: await superValidate(zod(reservation)),
		title: 'Nuova prenotazione | '
	};
};
