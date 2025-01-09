import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { reservation } from '$lib/schemas/reservation.js';
import { zod } from 'sveltekit-superforms/adapters';
import type { Service } from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const date = data.get('date') as string;
		const hour = data.get('hour') as string;

		if (!date || !hour) {
			return fail(404, { step: 'date', message: 'Devi inserire una data per la prenotazione' });
		}

		const service = data.get('service') as string;
		if (!service) {
			return fail(404, {
				step: 'service',
				message: 'Devi inserire un servizio per poter proseguire'
			});
		}

		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;

		if (!name || !surname || !email) {
			return fail(404, { step: 'info', message: 'Devi inserire i tuoi nominativi' });
		}

		if (!locals.user) {
			return fail(404, { message: 'Riprova' });
		} else {
			const booking: table.Booking = {
				date: date,
				id: crypto.randomUUID(),
				userID: locals.user.id,
				serviceID: service
			};

			await db.insert(table.booking).values(booking);
			return {
				bookingCreated: true
			};
		}
	}
};

export const load: PageServerLoad = async () => {
	const services = await db.select().from(table.service);
	return {
		services,
		form: await superValidate(zod(reservation))
	};
};
