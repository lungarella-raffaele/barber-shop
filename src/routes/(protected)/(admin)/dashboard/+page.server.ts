import { getLocalTimeZone, today } from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ReservationService } from '@service/reservation.service';

export const load: PageServerLoad = async ({ url }) => {
	const date = url.searchParams.get('date');

	const reservations = new ReservationService().getTodayReservations(
		date ?? today(getLocalTimeZone()).toString()
	);
	return {
		reservations,
		date,
		title: 'Admin -'
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const resService = new ReservationService();
		const data = await request.formData();

		const id = data.get('id') as string;

		const res = await resService.delete(id);

		if (res) {
			return {
				res
			};
		} else {
			return fail(500, { success: false });
		}
	}
};
