import { getString } from '$lib/utils.js';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { ReservationService, KindService, ShutdownService, UserService } from '@service';

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
		const staff = getString(data, 'staff');

		let result;
		if (user) {
			result = await reservationService.insertByUser({ hour, date, kind, staff }, user.data);
		} else if (name && email) {
			result = await reservationService.insertByUnkown({
				date,
				hour,
				kind,
				name,
				email,
				phoneNumber,
				staff
			});
		} else {
			return fail(404);
		}

		if (result.isOk()) {
			return result.value;
		} else {
			switch (result.error) {
				case 'conflict': {
					return fail(409);
				}
				default: {
					return fail(404);
				}
			}
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const kind = new KindService();
	const reservationService = new ReservationService();
	const shutdowns = new ShutdownService();

	const kinds = await kind.getAll();
	const currentReservations = await reservationService.getAll();
	const closures = await shutdowns.getAll();
	const staff = await new UserService().getAllStaff();

	if (!kinds || !currentReservations || !closures || !staff) {
		return error(500); //TODO
	}

	return {
		currentReservations,
		closures,
		kinds,
		staff,
		user: locals.user,
		title: 'Nuova prenotazione | '
	};
};
