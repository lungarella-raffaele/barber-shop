import { getReservationByID, updateReservation } from '$lib/server/backend/reservation';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const reservationID = url.searchParams.get('reservation');
	if (!reservationID) {
		redirect(307, '/');
	}
	const reservation = await getReservationByID(reservationID);
	if (!reservation || !reservation.pending) {
		redirect(307, '/');
	}

	const updated = await updateReservation(reservation.id);

	return {
		reservationConfirmed: true,
		reservation: updated
	};
};
