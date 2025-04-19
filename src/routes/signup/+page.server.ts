import { BASE_URL } from '$env/static/private';
import { verifyEmail } from '$lib/emails/verify-email';
import { signup } from '$lib/schemas/signup';
import { getUser, insertUser } from '$lib/server/backend/user';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { redirect } from '@sveltejs/kit';
import { hash } from 'argon2';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(signup)),
		title: 'Sign Up | '
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signup));
		if (!form.valid) {
			return message(form, {
				text: 'Le informazioni che hai inserito non sono valide',
				success: false
			});
		}

		const existingUser = await getUser(form.data.email);

		if (existingUser) {
			return message(form, {
				text: `L'email che hai inserito è gia un uso. Prova con un altro indirizzo email.`,
				success: false
			});
		}

		const { email, password, name, phoneNumber } = form.data;

		const userID = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			parallelism: 1
		});

		try {
			const user = await insertUser({
				id: userID,
				email,
				passwordHash,
				name,
				phoneNumber,
				isAdmin: false,
				pending: true
			});

			verifyEmail(name, email, `${BASE_URL}?user=${user.id}`);

			return message(form, { text: `Abbiamo inviato una mail di verifica a ${email}` });

			// const sessionToken = auth.generateSessionToken();
			// const session = await auth.createSession(sessionToken, userID);
			// auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.log(e);

			return message(form, {
				text: 'Al momento il servizio non risponde. Riprova in seguito.',
				success: true
			});
		}
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
