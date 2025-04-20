import { login } from '$lib/schemas/login';
import * as auth from '$lib/server/auth';
import { getUser } from '$lib/server/backend/user';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(login)),
		title: 'Sign In | '
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(login));
		if (!form.valid) {
			return fail(400, {
				message: 'I dati inseriti non sono validi',
				form
			});
		}

		const existingUser = await getUser(form.data.email);

		if (!existingUser || !existingUser.verifiedEmail) {
			return fail(400, {
				message: 'Email o password errati',
				form
			});
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {});

		if (!validPassword) {
			return fail(400, {
				message: 'Email o password errati',
				form
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		if (existingUser.isAdmin) {
			return redirect(302, '/dashboard');
		}
		return redirect(302, '/');
	}
};
