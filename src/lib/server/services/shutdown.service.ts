import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Shutdown } from '$lib/server/db/schema';

export class ShutdownService {
	async getAll(): Promise<Shutdown[]> {
		return await db.select().from(table.shutdowns);
	}
}
