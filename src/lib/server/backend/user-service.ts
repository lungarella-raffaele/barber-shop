import { db } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { deleteAllReservationsOfUser } from './reservation-service';

export async function insertUser(user: table.User) {
	const email = user.email.toLowerCase();
	await db.insert(table.user).values({
		id: user.id,
		email,
		passwordHash: user.passwordHash,
		name: user.name,
		phoneNumber: user.phoneNumber
	});
}

export async function getUser(email: string) {
	const lowercaseEmail = email.toLowerCase();
	return await db.select().from(table.user).where(eq(table.user.email, lowercaseEmail));
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
