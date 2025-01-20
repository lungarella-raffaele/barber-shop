import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export async function insertReservation(res: table.Reservation) {
	await db
		.insert(table.reservation)
		.values({ date: res.date, id: res.id, userID: res.userID, serviceID: res.serviceID });
}

