import * as table from '$lib/server/db/schema';
import { logger } from '../logger';
import { db } from '$lib/server/db';
import type { DBSchedule } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class ScheduleService {
	async getAll(): Promise<DBSchedule[] | null> {
		try {
			return db.select().from(table.schedule);
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async insert(schedule: DBSchedule[]): Promise<boolean> {
		try {
			const result = await db.insert(table.schedule).values(schedule).returning();
			return !!result;
		} catch (e) {
			logger.error(e);
			return false;
		}
	}

	async delete(id: number): Promise<boolean> {
		try {
			await db.delete(table.schedule).where(eq(table.schedule.id, id));
			return true;
		} catch (e) {
			logger.error(e);
			return false;
		}
	}
}
