import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger';

export async function getAllServices(onlyActive: boolean = true) {
	if (onlyActive) {
		return await db.select().from(table.service).where(eq(table.service.active, true));
	} else {
		return await db.select().from(table.service);
	}
}

export async function addService(service: table.Service) {
	try {
		return await db.insert(table.service).values(service).returning().get();
	} catch (err) {
		logger.error({ err, serviceData: service }, 'Error while adding service');
		throw err; // Re-throw to allow caller to handle or see the actual error
	}
}

export async function updateService(service: table.Service) {
	// Make sure we have an ID for the update
	if (!service.id) {
		logger.error('Attempted to update service without ID');
		throw new Error('Service ID is required for updates');
	}

	// eslint-disable-next-line
	const { id, ...serviceDataWithoutId } = service;

	try {
		return await db
			.update(table.service)
			.set(serviceDataWithoutId)
			.where(eq(table.service.id, service.id))
			.returning()
			.get();
	} catch (err) {
		logger.error({ err, serviceId: service.id }, 'Error while updating service');
		throw err; // Re-throw to allow caller to handle or see the actual error
	}
}

export async function deleteService(id: string) {
	return await db.delete(table.service).where(eq(table.service.id, id)).returning().get();
}
