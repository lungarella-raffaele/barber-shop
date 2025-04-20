import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { type RequestEvent } from '@sveltejs/kit';
import { and, count, eq, lt } from 'drizzle-orm';
import { logger } from '../logger';
import { deleteAllReservationsOfUser } from './reservation';

export async function insertUser(user: table.User) {
	return await db
		.insert(table.user)
		.values({ ...user, email: user.email.toLowerCase() })
		.returning()
		.get();
}

export async function getUser(email: string) {
	const lowercaseEmail = email.toLowerCase();
	return await db.select().from(table.user).where(eq(table.user.email, lowercaseEmail)).get();
}

export async function patchPendingUser(id: string) {
	return await db
		.update(table.user)
		.set({
			verifiedEmail: true
		})
		.where(eq(table.user.id, id))
		.returning()
		.get();
}

export async function getUserByID(id: string) {
	try {
		const user = await db.select().from(table.user).where(eq(table.user.id, id));
		return user[0] ?? null;
	} catch (err) {
		logger.error(err);
	}
}

export async function insertSession(session: table.Session) {
	return await db.insert(table.session).values(session);
}

export async function deleteAccount(user: table.User) {
	await deleteAllSessionOfUser(user.id);
	await deleteAllReservationsOfUser(user.email);
	return await db.delete(table.user).where(eq(table.user.id, user.id)).returning().get();
}

export async function logout(id: string, event: RequestEvent) {
	await auth.invalidateSession(id);
	auth.deleteSessionTokenCookie(event);
}

async function deleteAllSessionOfUser(id: string) {
	return await db.delete(table.session).where(eq(table.session.userID, id));
}

export async function getAllUnverifiedExpiredUsers() {
	const entries = await db
		.select({ count: count() })
		.from(table.user)
		.where(and(eq(table.user.verifiedEmail, false), lt(table.user.expiresAt, new Date())))
		.get();

	return entries?.count;
}
