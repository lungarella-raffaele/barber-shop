import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { DBShutdown } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
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

	async insert(start: string, end: string) {
		try {
			return await db
				.insert(table.shutdowns)
				.values({ id: crypto.randomUUID(), start, end })
				.returning({ id: table.shutdowns.id });
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async delete(id: string) {
		try {
			return await db
				.delete(table.shutdowns)
				.where(eq(table.shutdowns.id, id))
				.returning({ id: table.shutdowns.id });
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
