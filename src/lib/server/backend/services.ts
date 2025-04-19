import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getAllServices(onlyActive: boolean = true) {
	if (onlyActive) {
		return await db.select().from(table.service).where(eq(table.service.inactive, true));
	} else {
		return await db.select().from(table.service);
	}
}

export async function insertService(service: table.Service) {
	await db.insert(table.service).values(service).onConflictDoNothing();
}

export async function updateService(service: table.Service) {
	// eslint-disable-next-line
	const { id, ...serviceDataWithoutId } = service;

	return await db
		.update(table.service)
		.set(serviceDataWithoutId)
		.where(eq(table.service.id, service.id))
		.returning()
		.get();
}
