import type { Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		periods: await db.select().from(table.shutdowns)
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const start = data.get('start') as string;
		const end = data.get('end') as string;

		if (!start || !end) {
			return fail(404);
		}

		return {
			result: await db
				.insert(table.shutdowns)
				.values({ id: crypto.randomUUID(), start, end })
				.returning({ id: table.shutdowns.id })
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		await db.delete(table.shutdowns).where(eq(table.shutdowns.id, id));
	}
};
