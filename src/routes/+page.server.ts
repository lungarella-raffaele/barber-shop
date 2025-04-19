import { getReservationByID, updateReservationExpiration } from '$lib/server/backend/reservation';
import { getUserByID, patchPendingUser } from '$lib/server/backend/user';
import { expired } from '$lib/utils';
import type { PageServerLoad } from './$types';
import { PageCase, getPageCase } from './page-cases';

export const load: PageServerLoad = async (event) => {
	const url = event.url;
	const pageCase = getPageCase(url);

	switch (pageCase) {
		case PageCase.CONFIRM_RESERVATION: {
			const id = url.searchParams.get('reservation');

			if (!id) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'server_error'
				};
			}
			// Check if reservation exists
			const reservation = await getReservationByID(id);

			// Display error
			if (!reservation) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'server_error'
				};
			}

			if (expired(reservation.expiresAt.getTime())) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'expired'
				};
			}

			const available = reservation.pending;
			if (!available) {
				return {
					pageCase,
					success: true,
					reservation: reservation,
					error: null
				};
			}
			const updatedReservation = await updateReservationExpiration(reservation.id);

			return {
				pageCase,
				success: available,
				reservation: updatedReservation,
				error: null
			};
		}
		case PageCase.CONFIRM_USER: {
			const id = url.searchParams.get('user');
			if (!id) {
				return {
					pageCase,
					success: false,
					pendingUser: null,
					error: 'server_error'
				};
			}
			const user = await getUserByID(id);
			if (!user?.pending || !user) {
				return {
					pageCase,
					success: false,
					pendingUser: user,
					error: 'not_pending'
				};
			}

			const response = await patchPendingUser(user.id);
			if (!response) {
				return {
					pageCase,
					success: false,
					pendingUser: null,
					error: 'server_error'
				};
			}

			return {
				pageCase,
				success: true,
				pendingUser: response,
				error: null
			};
		}
		case PageCase.PENDING_RESERVATION: {
			const id = url.searchParams.get('pending');
			if (!id) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'server_error'
				};
			}
			const reservation = await getReservationByID(id);

			if (!reservation) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'server_error'
				};
			}

			if (expired(reservation.expiresAt.getTime())) {
				return {
					pageCase,
					success: false,
					reservation: null,
					error: 'expired'
				};
			}
			return {
				pageCase,
				success: true,
				reservation,
				error: null
			};
		}
		case PageCase.NORMAL: {
			return {
				pageCase,
				success: null,
				reservation: null,
				user: null,
				error: null
			};
		}
	}
};
