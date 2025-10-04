import { ReservationService } from '@service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const reservation = await new ReservationService().getByID(params.reservation);

	if (
		!reservation ||
		(reservation.email !== locals.user?.data.email && locals.user?.role !== 'staff')
	) {
		return error(404, 'Non hai nessuna prenotazione con questo codice');
	}
	return { reservation: reservation };
};
