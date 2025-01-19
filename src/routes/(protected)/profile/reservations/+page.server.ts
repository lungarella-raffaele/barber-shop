import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login');
	}

	const reservations: table.Reservation[] = await db
		.select()
		.from(table.reservation)
		.where(eq(table.reservation.userID, locals.user.id));
	console.log(reservations);

	return { reservations };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		console.log('Daje');

		const idToDelete = data.get('id') as string;

		// if (!idToDelete) {
		// reservationDeleted: false
		// }

		const deletedReservation = await db
			.delete(table.reservation)
			.where(eq(table.reservation.id, idToDelete));

		if (deletedReservation) {
			return {
				reservationDeleted: true
			};
		} else {
			return {
				reservationDeleted: false
			};
		}
	}
};
