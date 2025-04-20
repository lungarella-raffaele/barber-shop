import { deleteExpiredItems } from '$lib/server/backend/clean-up';
import { getAllExpiredReservations } from '$lib/server/backend/reservation';
import { getAllUnverifiedExpiredUsers } from '$lib/server/backend/user';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const usersCount = await getAllUnverifiedExpiredUsers();
	const reservationsCounts = await getAllExpiredReservations();

	return {
		usersCount,
		reservationsCounts
	};
};

export const actions: Actions = {
	default: async () => {
		try {
			await deleteExpiredItems();
		} catch {
			return {
				success: false
			};
		}

		return {
			success: true
		};
	}
};
