import { UserService } from '@service';
import type { Actions, PageServerLoad } from './$types';
import { ReservationService, CleanupService } from '@service';

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
