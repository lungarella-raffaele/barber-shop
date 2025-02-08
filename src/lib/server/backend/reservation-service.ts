import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Reservation } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger';

export async function insertReservation(reservation: Reservation): Promise<Reservation | null> {
	const queryRes = await db
		.insert(table.reservation)
		.values({
			date: reservation.date,
			id: reservation.id,
			serviceID: reservation.serviceID,
			hour: reservation.hour,
			name: reservation.name,
			email: reservation.email
		})
		.returning();

	const res = queryRes[0];
	if (!res) {
		logger.error('Could not insert a reservation');
		return null;
	}
	logger.info('Reservation created successfully');
	return res;
}

export async function getReservations() {
	// TODO Select only from current date
	return await db
		.select({
			date: table.reservation.date,
			startingTime: table.reservation.hour,
			duration: table.service.duration
		})
		.from(table.reservation)
		.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id));
}
