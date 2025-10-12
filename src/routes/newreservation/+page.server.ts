import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { ReservationService, KindService, ShutdownService, UserService } from '@service';
import type { Data } from '@types';
import { logger } from '$lib/server/logger.js';
import { EmailService } from '$lib/server/mailer.js';
import { formatDate, formatTime } from '$lib/utils.js';
import { BASE_URL } from '$env/static/private';

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
		let result: Awaited<ReturnType<typeof reservationService.insertByUser>> | undefined =
			undefined;
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
			if (data.who === 'anonymous') {
				const sent = await new EmailService().newReservation({
					name: data.name,
					link: `${BASE_URL}?reservation=${result.value.id}`,
					staffName: result.value.staffID,
					serviceName: result.value.kindID,
					date: formatDate(result.value.date),
					hour: formatTime(result.value.hour),
					to: data.email
				});

				if (sent.isErr()) {
					logger.error('Could not send email');
					return fail(404); // TODO: Better error handling
				}
			}

			return result.value;
		} else {
			logger.error(result.error);
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
