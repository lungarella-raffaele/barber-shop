import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export async function getAllServices() {
	return await db.select().from(table.service);
}

export async function insertService(service: table.Service) {
	await db.insert(table.service).values(service).onConflictDoNothing();
}
