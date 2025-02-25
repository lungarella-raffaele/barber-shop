import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Closure } from '$lib/server/db/schema';

export async function getClosures(): Promise<Closure[]> {
	return await db.select().from(table.closures);
}
