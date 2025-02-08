import { getAllReservations, getDayReservations } from '$lib/server/backend/reservation-service';
import { logger } from '$lib/server/logger';
import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	return {
		reservations: await getAllReservations()
	};
};

export const actions: Actions = {
	getReservation: async ({ request }) => {
		const data = await request.formData();
		const date = data.get('date') as string;
		const reservations = await getDayReservations(date);
		return { reservations };
	}
};
