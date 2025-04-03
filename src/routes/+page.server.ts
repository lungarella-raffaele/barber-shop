import { getReservationByID, updateReservationExpiration } from '$lib/server/backend/reservation';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { expired } from '$lib/utils';

export const load: PageServerLoad = async ({ url }) => {
	const confirmReservation = url.searchParams.get('reservation');
	const confirmUser = url.searchParams.get('user');
	const pendingReservation = url.searchParams.get('pending');
	if (confirmReservation) {
		const reservation = await getReservationByID(confirmReservation);
		if (!reservation) {
			redirect(307, '/');
		}

		const available = reservation.pending;
		if (available) {
			await updateReservationExpiration(reservation.id);
		}

		return {
			reservationConfirmed: available,
			reservation: available ? reservation : null
		};
	} else if (confirmUser) {
		// const reservation = await getReservationByID(reservationID);
		// if (!reservation || !reservation.pending) {
		// 	redirect(307, '/');
		// }
		// const updated = await updateReservation(reservation.id);
		// return {
		// 	reservationConfirmed: true,
		// 	reservation: updated
		// };
	} else if (pendingReservation) {
		const reservation = await getReservationByID(pendingReservation);

		if (!reservation) {
			redirect(307, '/');
		}

		if (expired(reservation.expiresAt.getTime())) {
			redirect(307, '/');
		}
		return {
			pendingReservation: reservation
		};
	}
};
