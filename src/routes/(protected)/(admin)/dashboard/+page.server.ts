import { deleteReservation, getDayReservations } from '$lib/server/backend/reservation';
import { getLocalTimeZone, today } from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const date = url.searchParams.get('date');
	const reservations = await getDayReservations(date ?? today(getLocalTimeZone()).toString());
	return {
		reservations,
		date,
		title: 'Admin |'
	};
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
