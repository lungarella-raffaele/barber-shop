import type { PageServerLoad } from './$types';
import { getReservationByID } from '$lib/server/backend/reservation-service';

export const load: PageServerLoad = async ({ params }) => {
	const reservation = await getReservationByID(params.id);
	return { reservation: reservation[0] };
};
