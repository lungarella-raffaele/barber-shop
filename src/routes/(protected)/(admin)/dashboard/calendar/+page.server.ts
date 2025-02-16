import type { Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		periods: await db.select().from(table.closures)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const start = data.get('start') as string;
		const end = data.get('end') as string;

		if (!start || !end) {
			return fail(404);
		}

		return {
			result: await db
				.insert(table.closures)
				.values({ id: crypto.randomUUID(), start, end })
				.returning({ id: table.closures.id })
		};
	}
};
