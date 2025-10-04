import { BASE_URL } from '$env/static/private';
import { recoverPassword } from '$lib/emails/recover-password';
import { emailSchema } from '$lib/modules/zod-schemas';
import { loginSchema } from '$lib/modules/zod-schemas';
import * as auth from '$lib/server/auth';
import { getString } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { UserService } from '@service';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(loginSchema)),
		title: 'Sign In | '
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, {
				success: false,
				message: 'I dati inseriti non sono validi',
				form
			});
		}

		const existingUser = await new UserService().get(form.data.email);

		if (!existingUser || !existingUser.data.verifiedEmail) {
			return fail(400, {
				success: false,
				message: 'Email o password errati',
				form
			});
		}

		const validPassword = await verify(existingUser.data.passwordHash, form.data.password, {});

		if (!validPassword) {
			return fail(400, {
				success: false,
				message: 'Email o password errati',
				form
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.data.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		if (existingUser.role === 'staff') {
			return redirect(302, '/dashboard');
		}
		return redirect(302, '/');
	},
	recoverPassword: async ({ request }) => {
		const data = await request.formData();

		const email = getString(data, 'email');

		if (!email) {
			return fail(404, { success: false, message: 'Nessuna mail inserita.' });
		}

		const correctEmail = emailSchema.safeParse({ email });
		if (!correctEmail.success) {
			return fail(404, { success: false, message: 'Inserisci una mail valida' });
		}

		const userService = new UserService();
		const user = await userService.get(email);
		if (!user) {
			return {
				success: true,
				message:
					'Se la mail inserita è giusta ti arriverà una mail per aggiornare la password del tuo account'
			};
		}

		const recover = await userService.insertPasswordRecover(user.data.id);

		const { error } = await recoverPassword(
			user.data.name,
			email,
			`${BASE_URL}?recover=${recover.id}`
		);

		if (error) {
			return fail(500, {
				success: false,
				message: `C'è stato un problema. Riprova più tardi.`
			});
		}

		return {
			success: true,
			message:
				'Se la mail inserita è giusta ti arriverà una mail per aggiornare la password del tuo account'
		};
	}
};
