import type { PageServerLoad } from './$types';
import { getReservationByID } from '$lib/server/backend/reservation-service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const reservation = await getReservationByID(params.reservation);

	if (!reservation || (reservation.email !== locals.user?.email && !locals.user?.isAdmin)) {
		return error(404, 'Non hai nessuna prenotazione con questo codice');
	}
	return { reservation: reservation };
};
