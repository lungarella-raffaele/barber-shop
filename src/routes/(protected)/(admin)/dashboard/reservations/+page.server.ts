import { getDayReservations } from '$lib/server/backend/reservation-service';
import { logger } from '$lib/server/logger';
import { getLocalTimeZone, today } from '@internationalized/date';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		reservations: await getDayReservations(today(getLocalTimeZone()).toString())
	};
};

export const actions: Actions = {
	getReservation: async ({ request }) => {
		const data = await request.formData();
		const date = data.get('date') as string;
		const reservations = await getDayReservations(date);
		logger.info(reservations, 'Reservations: ');
		return { reservations };
	}
};
