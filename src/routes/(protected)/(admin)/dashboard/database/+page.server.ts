import { UserService } from '@services/user.service';
import type { Actions, PageServerLoad } from './$types';
import { ReservationService } from '@services/reservation.service';
import { deleteExpiredItems } from '@services/clean-up.service';

export const load: PageServerLoad = async () => {
	const user = new UserService();
	const reservationS = new ReservationService();
	const usersCount = await user.getAllUnverifiedExpiredUsers();
	const reservationsCounts = await reservationS.getAllExpired();

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
