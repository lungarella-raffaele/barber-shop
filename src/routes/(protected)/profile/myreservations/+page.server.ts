import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';
import { deleteReservation, getReservationsByUser } from '$lib/server/backend/reservation';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login');
	}

	const reservations = await getReservationsByUser(locals.user.email);

	logger.info(`Retrieved ${reservations.length} reservations`);

	return { reservations, title: 'Prenotazioni | ' };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('id') as string;

		const res = await deleteReservation(id);

		if (res) {
			return {
				res
			};
		} else {
			return fail(500, { success: false });
		}
	}
};
