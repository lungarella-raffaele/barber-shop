import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { bookSchema } from '$lib/validation/book.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(bookSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(bookSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const request = event.request;
		const data = await request.formData();
		const booking = data.get('booking') as string;
		console.log(JSON.parse(booking));
	}
};
