import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { logger } from '../logger';

export class BannerService {
	async get() {
		try {
			return await db.select().from(table.banner).get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async update(message: string, visible: boolean) {
		try {
			await db.delete(table.banner);
			return await db.insert(table.banner).values({ message, visible }).returning().get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
