import * as auth from '$lib/server/auth';
import { getReservationByID, updateReservationExpiration } from '$lib/server/backend/reservation';
import {
	expirePasswordRecover,
	getPasswordRecover,
	getUserByID,
	patchPassword,
	patchPendingUser
} from '$lib/server/backend/user';
import { logger } from '$lib/server/logger';
import { expired, getString } from '$lib/utils';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { hash } from 'argon2';
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
			if (user?.verifiedEmail || !user) {
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

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, response.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			throw redirect(302, url.pathname + url.search);
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
		case PageCase.RECOVER_PASSWORD: {
			const id = url.searchParams.get('recover');
			if (!id) {
				return {
					pageCase,
					success: false,
					recoverID: null,
					error: 'server_error'
				};
			}
			const passwordRecover = await getPasswordRecover(id);
			if (!passwordRecover) {
				return {
					pageCase,
					success: false,
					recoverID: null,
					error: 'server_error'
				};
			}

			if (!passwordRecover.expiresAt || expired(passwordRecover.expiresAt?.getTime())) {
				return {
					pageCase,
					success: false,
					recoverID: null,
					error: 'expired'
				};
			}

			return {
				pageCase,
				recoverID: passwordRecover.id,
				success: true,
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

export const actions: Actions = {
	changePassword: async (event) => {
		const data = await event.request.formData();
		const password = getString(data, 'new-pass');
		const recoverID = getString(data, 'recover-id');

		if (!password) {
			return fail(400, { message: 'Inserisci le informazioni necessarie' });
		}

		const passwordRecover = await getPasswordRecover(recoverID);

		if (!passwordRecover) {
			logger.error(
				`${event.url}: Could not update password, the password recover does not exist`
			);
			return fail(500, {
				message: `C'è stato un problema con la tua richiesta`,
				error: 'server_error'
			});
		}

		if (
			!passwordRecover.expiresAt ||
			(passwordRecover.expiresAt && expired(passwordRecover.expiresAt.getTime()))
		) {
			logger.error(`${event.url}: Could not update password, the request is expired`);
			return fail(500, { message: 'La richiesta è scaduta', error: 'expired' });
		}

		expirePasswordRecover(passwordRecover.id);
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			parallelism: 1
		});
		const response = await patchPassword(passwordHash, passwordRecover.userID);

		if (!response) {
			logger.error(
				`${event.url}: Could not update password because the password patch was not successfull`
			);
			return fail(404, {
				message: 'Non è stato possibile aggiornare la password'
			});
		}

		const user = await getUserByID(passwordRecover.userID);

		if (!user) {
			logger.error(`${event.url}: Could not find user`);
			return;
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		if (user.isAdmin) {
			return redirect(302, '/dashboard');
		}
		return redirect(302, '/');
	}
};
