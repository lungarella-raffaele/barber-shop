import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getReservationByID, updateReservation } from '$lib/server/backend/reservation';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const banner = await db.select().from(table.banner).get();

	const reservationID = url.searchParams.get('reservation');
	const userID = url.searchParams.get('user');
	if (reservationID) {
		const reservation = await getReservationByID(reservationID);
		if (!reservation || !reservation.pending) {
			redirect(307, '/');
		}

		const updated = await updateReservation(reservation.id);

		return {
			user: locals.user,
			title: 'Home | ',
			banner,
			reservationConfirmed: true,
			reservation: updated
		};
	} else if (userID) {
		// const reservation = await getReservationByID(reservationID);
		// if (!reservation || !reservation.pending) {
		// 	redirect(307, '/');
		// }
		// const updated = await updateReservation(reservation.id);
		// return {
		// 	reservationConfirmed: true,
		// 	reservation: updated
		// };
	}

	return { user: locals.user, title: 'Home | ', banner };
};
