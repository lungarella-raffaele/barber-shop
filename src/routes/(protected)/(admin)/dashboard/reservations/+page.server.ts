import { getDayReservations } from '$lib/server/backend/reservation-service';
import type { Actions } from './$types';

export const actions: Actions = {
	getReservation: async ({ request }) => {
		const formData = await request.formData();
		const date = formData.get('date') as string;
		const reservations = await getDayReservations(date);
		return { reservations };
	}
};
