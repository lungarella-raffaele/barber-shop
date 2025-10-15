import type { Actions } from './$types';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { ShutdownService } from '@service/shutdown.service';
import { ScheduleService } from '@service/schedule.service';
import type { DBSchedule } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	return {
		periods: new ShutdownService().getAll(),
		schedule: new ScheduleService().getAll()
	};
};

export const actions: Actions = {
	insertShutdown: async ({ request }) => {
		const data = await request.formData();
		const start = data.get('start') as string;
		const end = data.get('end') as string;

		if (!start || !end) {
			return fail(404);
		}
		return await new ShutdownService().insert(start, end);
	},
	deleteShutdown: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		return await new ShutdownService().delete(id);
	},
	addSchedule: async ({ request, locals }) => {
		const data = await request.formData();

		let dbschedule = JSON.parse(data.get('data') as string) as DBSchedule[];

		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const staffID = locals.user.data.id;

		dbschedule = dbschedule.map((schedule) => {
			return {
				staffID,
				day: schedule.day,
				startHour: schedule.startHour,
				startMinute: schedule.startMinute,
				endHour: schedule.endHour,
				endMinute: schedule.endMinute
			};
		});

		return { success: await new ScheduleService().insert(dbschedule) };
	}
};
