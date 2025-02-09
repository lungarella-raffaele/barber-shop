import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	const banner = await db.select().from(table.banner).get();

	return { user: locals.user, title: 'Home | ', banner };
};
