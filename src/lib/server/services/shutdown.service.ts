import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { DBShutdown } from '$lib/server/db/schema';
import { logger } from '../logger';

export class ShutdownService {
	async getAll(): Promise<DBShutdown[] | null> {
		try {
			return await db.select().from(table.shutdowns);
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
