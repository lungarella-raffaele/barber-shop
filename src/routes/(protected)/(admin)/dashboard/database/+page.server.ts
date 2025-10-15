import { UserService } from '@service/user.service.js';
import type { Actions, PageServerLoad } from './$types';
import { ReservationService } from '@service/reservation.service.js';
import { CleanupService } from '@service/clean-up.service.js';

export const load: PageServerLoad = async () => {
	const user = new UserService();
	const reservationS = new ReservationService();
	const usersCount = await user.countExpired();
	const reservationsCounts = await reservationS.countExpired();

	return {
		usersCount,
		reservationsCounts
	};
};

export const actions: Actions = {
	default: async () => {
		try {
			await new CleanupService().deleteExpiredItems();
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
