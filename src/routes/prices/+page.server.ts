import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema.js';

export const load: PageServerLoad = async () => {
	return {
		services: await db.select().from(table.service)
	};
};
