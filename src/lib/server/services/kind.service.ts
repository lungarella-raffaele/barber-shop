import { db } from '$lib/server/db';
import * as T from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger';
import { ok, err, type Result } from '$lib/modules/result';

export class KindService {
	async getAll(onlyActive: boolean = true) {
		if (onlyActive) {
			return await db.select().from(T.kind).where(eq(T.kind.active, true));
		} else {
			return await db.select().from(T.kind);
		}
	}

	async insert(kind: T.Kind): Promise<Result<T.Kind, string>> {
		try {
			return ok(await db.insert(T.kind).values(kind).returning().get());
		} catch (e) {
			logger.error({ e, kind }, 'Error while adding kind');
			return err('Could not insert kind');
		}
	}

	async update(kind: T.Kind) {
		// Make sure we have an ID for the update
		if (!kind.id) {
			logger.error('Attempted to update kind without ID');
			throw new Error('Kind ID is required for updates');
		}

		// eslint-disable-next-line
		const { id, ...kindWID } = kind;

		try {
			return await db
				.update(T.kind)
				.set(kindWID)
				.where(eq(T.kind.id, kind.id))
				.returning()
				.get();
		} catch (err) {
			logger.error({ err, kindID: kind.id }, 'Error while updating kind');
			throw err; // Re-throw to allow caller to handle or see the actual error
		}
	}

	async delete(id: string) {
		return await db.delete(T.kind).where(eq(T.kind.id, id)).returning().get();
	}
}
