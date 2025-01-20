import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = ({ locals }) => {
	return { user: locals.user, title: 'Profilo | ' };
};

export const actions: Actions = {
	logout: async (event) => {
		console.log('Logging out...');
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};
