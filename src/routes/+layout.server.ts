import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { init } from '$lib/server/db/init';

export const load: LayoutServerLoad = async ({ locals }) => {
	init();
	const banner = await db.select().from(table.banner).get();

	const user = locals.user;
	const title = 'Home |';

	return { user, title, banner };
};
