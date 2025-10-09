import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { ReservationService, KindService, ShutdownService, UserService } from '@service';
import type { Data } from '@types';
import { logger } from '$lib/server/logger.js';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = locals.user;
		const formData = await request.formData();

		let data: Data | undefined;
		try {
			data = JSON.parse(formData.get('data') as unknown as string);
		} catch (e) {
			logger.warn(e);
			return fail(404);
		}

		if (!data) {
			return fail(404);
		}

		const reservationService = new ReservationService();
		let result;
		if (data.who === 'usual') {
			if (!user) {
				logger.error(
					'Tried to insert a reservation by an usual user while not being logged in'
				);
				redirect(308, '/login');
			}
			result = await reservationService.insertByUser(data, user.data);
		} else if (data.who === 'anonymous') {
			result = await reservationService.insertByAnonymous(data);
		} else if (data.who === 'staff') {
			if (!user) {
				logger.error(
					'Tried to insert a reservation by an usual user while not being logged in'
				);
				redirect(308, '/login');
			}
			const alternativeName = formData.get('alternativeName') as string;
			result = await reservationService.insertByStaff(data, user.data, alternativeName);
		} else {
			logger.error('Did not specify the kind of user');
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

	const [kinds, currentReservations, closures, staff] = await Promise.all([
		kind.getAll(),
		reservationService.getAll(),
		shutdowns.getAll(),
		new UserService().getAllStaff()
	]);

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
