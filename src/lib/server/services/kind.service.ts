import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger';
import { ok, err, type Result } from '$lib/modules/result';

export class KindService {
	async getAll(onlyActive: boolean = true) {
		try {
			return await db.select().from(table.kind).where(eq(table.kind.active, onlyActive));
		} catch {
			return null;
		}
	}

	async insert(kind: table.DBKind): Promise<Result<table.DBKind, string>> {
		try {
			return ok(await db.insert(table.kind).values(kind).returning().get());
		} catch (e) {
			logger.error({ e, kind }, 'Error while adding kind');
			return err('Could not insert kind');
		}
	}

	async update(kind: table.DBKind) {
		// Make sure we have an ID for the update
		if (!kind.id) {
			logger.error('Attempted to update kind without ID');
			throw new Error('Kind ID is required for updates');
		}

		// eslint-disable-next-line
		const { id, ...kindWID } = kind;

		try {
			return await db
				.update(table.kind)
				.set(kindWID)
				.where(eq(table.kind.id, kind.id))
				.returning()
				.get();
		} catch (err) {
			logger.error({ err, kindID: kind.id }, 'Error while updating kind');
			throw err; // Re-throw to allow caller to handle or see the actual error
		}
	}

	async delete(id: string) {
		return await db.delete(table.kind).where(eq(table.kind.id, id)).returning().get();
	}
}
