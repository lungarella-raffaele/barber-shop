import { signupSchema } from '$lib/modules/zod-schemas';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { UserService } from '@service';
import { verifyEmail } from '$lib/emails/verify-email';
import { BASE_URL } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(signupSchema)),
		title: 'Sign Up | '
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signupSchema));
		if (!form.valid) {
			return message(form, {
				text: 'Le informazioni che hai inserito non sono valide',
				success: false
			});
		}

		const { email, password, name, phoneNumber } = form.data;
		const userService = new UserService();
		const user = await userService.insertUser({ email, password, name, phoneNumber });

		if (user.isOk()) {
			verifyEmail(name, email, `${BASE_URL}?user=${user.unwrap().id}`);
			return message(form, {
				text: `Abbiamo inviato una mail di verifica a ${email}`,
				success: true
			});
		} else {
			return message(form, {
				text: 'Al momento il servizio non risponde. Riprova in seguito.',
				success: false
			});
		}
	}
};
