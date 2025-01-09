import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { login } from '$lib/schemas/login';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(login))
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

		const results = await db.select().from(table.user).where(eq(table.user.email, form.data.email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, {
				message: 'Email o password errati',
				form
			});
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, {
				message: 'Email o password errati',
				form
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
};
