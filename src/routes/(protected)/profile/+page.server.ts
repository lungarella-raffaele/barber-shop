import { BASE_URL } from '$env/static/private';
import { changeEmail } from '$lib/emails/change-email';
import { emailSchema } from '$lib/schemas/email';
import { newPassword as newPasswordSchema } from '$lib/schemas/password';
import {
	deleteAccount,
	deleteEmailVerification,
	getEmailVerification,
	getUser,
	insertEmailVerification,
	logout,
	patchEmailUser,
	patchPassword,
	updateName,
	updatePhoneNumber
} from '$lib/server/backend/user';
import { logger } from '$lib/server/logger';
import { getString } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { hash, verify } from 'argon2';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const confirmID = url.searchParams.get('confirm-email-change');

	if (confirmID) {
		const verified = await getEmailVerification(confirmID);
		await patchEmailUser(verified.userID, verified.email);

		throw redirect(302, url.pathname);
	}

	return {
		user: locals.user,
		title: 'Profilo | '
	};
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
	updateInfo: async ({ locals, request, url }) => {
		if (!locals.session || !locals.user) {
			return fail(401, { success: false });
		}

		const formData = await request.formData();
		const phone = getString(formData, 'phone');
		const name = getString(formData, 'name');

		if (!name) {
			return fail(400, { success: false });
		}

		if (locals.user.phoneNumber !== phone) {
			await updatePhoneNumber(locals.user.id, phone);
		}

		if (name && locals.user.name !== name) {
			await updateName(locals.user.id, name);
		}

		throw redirect(302, url.pathname);
	},
	changeEmail: async ({ locals, request }) => {
		if (!locals.session || !locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const email = getString(formData, 'email');

		const correctEmail = emailSchema.safeParse({ email });

		if (!correctEmail.success) {
			return fail(400, { message: 'Inserisci una mail valida', success: false });
		}

		const existingUser = await getUser(email);

		if (existingUser && existingUser.verifiedEmail) {
			return fail(400, {
				message: 'Esiste già un utente con la mail inserita',
				success: false
			});
		}

		const emailVerification = await insertEmailVerification(email, locals.user.id);

		const { error } = await changeEmail(
			locals.user.name,
			email,
			`${BASE_URL}/profile?confirm-email-change=${emailVerification.id}`
		);

		if (error) {
			logger.error('Email bounced');
			await deleteEmailVerification(emailVerification.id);
			return fail(500, {
				message: 'Riprova più tardi',
				success: false
			});
		}

		return {
			success: true
		};
	},
	deleteAccount: async (event) => {
		const user = event.locals.user;
		const session = event.locals.session;

		if (!user || !session) {
			logger.warn('Cannot delete account');
			return fail(403);
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
	},
	changePassword: async (event) => {
		const user = event.locals.user;
		const session = event.locals.session;

		if (!user || !session) {
			return fail(400);
		}

		const formData = await event.request.formData();
		const newPassword = getString(formData, 'new-pass');
		const oldPassword = getString(formData, 'old-pass');

		const isPasswordSafe = newPasswordSchema.safeParse({ password: newPassword });

		if (!isPasswordSafe.success) {
			return fail(404, { message: 'La password inserita non è sicura' });
		}

		const validPassword = await verify(user.passwordHash, oldPassword, {});

		if (!validPassword) {
			return fail(404, {
				message: 'La password attuale non è corretta'
			});
		}

		if (newPassword === oldPassword) {
			return fail(404, {
				message: 'Devi inserire una password diversa dalla precedente'
			});
		}

		const passwordHash = await hash(newPassword, {
			memoryCost: 19456,
			timeCost: 2,
			parallelism: 1
		});

		const response = await patchPassword(passwordHash, user.id);
		if (!response) {
			return fail(404, {
				message: 'Non è stato possibile aggiornare la password'
			});
		}
	}
};
