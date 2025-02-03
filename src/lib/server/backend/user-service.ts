import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export async function insertUser(user: table.User) {
	await db.insert(table.user).values({
		id: user.id,
		email: user.email,
		passwordHash: user.passwordHash,
		name: user.name,
		phoneNumber: user.phoneNumber
	});
}

export async function getUser(email: string) {
	return await db.select().from(table.user).where(eq(table.user.email, email));
}

export async function insertSession(session: table.Session) {
	return await db.insert(table.session).values(session);
}

// const results = await db.select().from(table.user).where(eq(table.user.email, form.data.email));
