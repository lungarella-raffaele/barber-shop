import { getString } from '$lib/utils.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { ReservationService, KindService, ShutdownService } from '@service';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const reservationService = new ReservationService();
		const user = locals.user;
		const data = await request.formData();

		const email = getString(data, 'email');
		const name = getString(data, 'name');
		const phoneNumber = getString(data, 'phone');
		const kind = getString(data, 'kind');
		const date = getString(data, 'date');
		const hour = getString(data, 'hour');

		if (user) {
			return reservationService.insertByUser({ hour, date, kind }, user);
		} else if (name && email) {
			return reservationService.insertByUnkown({
				date,
				hour,
				kind,
				name,
				email,
				phoneNumber
			});
		} else {
			return fail(500);
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const kind = new KindService();
	const reservationService = new ReservationService();
	const shutdowns = new ShutdownService();

	const kinds = await kind.getAll();
	const currentReservations = await reservationService.get();

	const closures = await shutdowns.getAll();

	return {
		currentReservations,
		closures,
		kinds,
		user: locals.user,
		title: 'Nuova prenotazione | '
	};
};
