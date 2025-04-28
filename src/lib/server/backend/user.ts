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

export async function patchPassword(passwordHash: string, id: string) {
	return await db
		.update(table.user)
		.set({ passwordHash })
		.where(eq(table.user.id, id))
		.returning()
		.get();
}

export async function patchEmailUser(id: string, email: string) {
	return await db
		.update(table.user)
		.set({
			email
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
	await deleteAllReservationsOfUser(user.email);
	await deleteAllVerificationTokens(user.id);
	return await db.delete(table.user).where(eq(table.user.id, user.id)).returning().get();
}

export async function logout(id: string, event: RequestEvent) {
	await auth.invalidateSession(id);
	auth.deleteSessionTokenCookie(event);
}

async function deleteAllVerificationTokens(id: string) {
	return await db.delete(table.session).where(eq(table.emailVerification.userID, id));
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

export async function updatePhoneNumber(id: string, phoneNumber: string) {
	return await db
		.update(table.user)
		.set({ phoneNumber: phoneNumber.trim() })
		.where(eq(table.user.id, id));
}

export async function updateName(id: string, name: string) {
	return await db.update(table.user).set({ name: name.trim() }).where(eq(table.user.id, id));
}

export async function updateUserInfo(id: string, name?: string, phoneNumber?: string) {
	const updateData: Record<string, string> = {};

	if (name?.trim()) {
		updateData.name = name;
	}

	if (phoneNumber?.trim()) {
		updateData.phoneNumber = phoneNumber;
	}

	if (Object.keys(updateData).length === 0) {
		// Nothing to update
		return;
	}
	return await db.update(table.user).set(updateData).where(eq(table.user.id, id));
}

export async function insertEmailVerification(newEmail: string, userID: string) {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 1); // Add one day

	return await db
		.insert(table.emailVerification)
		.values({
			id: crypto.randomUUID(),
			userID,
			expiresAt,
			email: newEmail
		})
		.returning()
		.get();
}

export async function deleteEmailVerification(id: string) {
	return await db.delete(table.emailVerification).where(eq(table.emailVerification.id, id));
}

export async function getEmailVerification(id: string) {
	const _ = await db
		.select()
		.from(table.emailVerification)
		.where(eq(table.emailVerification.id, id));
	return _[0];
}
