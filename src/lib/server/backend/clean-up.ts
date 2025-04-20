import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq, lt } from 'drizzle-orm';
import { logger } from '../logger';

export async function deleteExpiredItems() {
	await deleteAllExpiredReservations();
	await deleteAllExpiredUsers();
}

async function deleteAllExpiredReservations() {
	try {
		return await db
			.delete(table.reservation)
			.where(lt(table.reservation.expiresAt, new Date()));
	} catch (err) {
		logger.error('Error while removing expired reservations');
		console.error(err);
	}
}

export async function deleteAllExpiredUsers() {
	try {
		return await db
			.delete(table.user)
			.where(and(eq(table.user.verifiedEmail, false), lt(table.user.expiresAt, new Date())));
	} catch (err) {
		logger.error('Error while removing expired users');
		console.error(err);
	}
}
