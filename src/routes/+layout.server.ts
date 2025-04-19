import { db } from '$lib/server/db';
import { init } from '$lib/server/db/init';
import * as table from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	init();
	const banner = (await db.select().from(table.banner).get()) ?? null;

	const user = locals.user;
	const title = 'Home |';

	return { user, title, banner };
};
