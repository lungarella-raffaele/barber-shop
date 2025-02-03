import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Reservation } from '$lib/server/db/schema';
import { logger } from '../logger';

export async function insertReservation(reservation: Reservation): Promise<Reservation | null> {
	const queryRes = await db
		.insert(table.reservation)
		.values({
			date: reservation.date,
			id: reservation.id,
			userID: reservation.userID,
			serviceID: reservation.serviceID,
			slot: reservation.slot
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
