import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';
import { deleteAccount, logout } from '$lib/server/backend/user';

export const load: PageServerLoad = ({ locals }) => {
	return { user: locals.user, title: 'Profilo | ' };
};

export const actions: Actions = {
	logout: async (event) => {
		logger.info('Logging out...');
		if (!event.locals.session) {
			return fail(401);
		}

		await logout(event.locals.session.id, event);

		return redirect(302, '/');
	},
	deleteAccount: async (event) => {
		const user = event.locals.user;
		const session = event.locals.session;

		if (!user || !session) {
			logger.warn('Cannot delete account');
			return fail(404);
		}

		logger.warn('Deleting account of user: ' + user.email);
		const res = await deleteAccount(user);

		if (res) {
			logger.info('Successfully deleted account of user: ' + res.email);
			await logout(session.id, event);

			return redirect(302, '/');
		} else {
			logger.error('Error while deleting account of user: ' + user.email);
			return fail(500);
		}
	}
};
