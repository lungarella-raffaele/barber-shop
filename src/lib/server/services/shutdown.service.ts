import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { DBShutdown } from '$lib/server/db/schema';

export class ShutdownService {
	async getAll(): Promise<DBShutdown[]> {
		return await db.select().from(table.shutdowns);
	}
}
