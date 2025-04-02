import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Reservation } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '../logger';

export async function insertReservation(reservation: Reservation): Promise<Reservation | null> {
	const queryRes = await db
		.insert(table.reservation)
		.values({ ...reservation })
		.returning();

	const res = queryRes[0];
	if (!res) {
		logger.error('Could not insert a reservation');
		return null;
	}
	logger.info('Reservation created successfully');
	return res;
}

export async function deleteReservation(id: string) {
	return await db.delete(table.reservation).where(eq(table.reservation.id, id)).returning();
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

export async function getAllReservations() {
	return await db
		.select({
			id: table.reservation.id,
			date: table.reservation.date,
			hour: table.reservation.hour,
			name: table.reservation.name,
			email: table.reservation.email,
			serviceName: table.service.name,
			serviceDuration: table.service.duration,
			servicePrice: table.service.price
		})
		.from(table.reservation)
		.where(eq(table.reservation.pending, false))
		.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id));
}

export async function getDayReservations(date: string) {
	return await db
		.select({
			id: table.reservation.id,
			date: table.reservation.date,
			hour: table.reservation.hour,
			name: table.reservation.name,
			email: table.reservation.email,
			serviceName: table.service.name,
			serviceDuration: table.service.duration,
			servicePrice: table.service.price
		})
		.from(table.reservation)
		.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id))
		.where(and(eq(table.reservation.date, date), eq(table.reservation.pending, false)));
}

export async function getReservationsByUser(email: string) {
	return await db
		.select({
			id: table.reservation.id,
			date: table.reservation.date,
			hour: table.reservation.hour,
			name: table.reservation.name,
			email: table.reservation.email,
			serviceName: table.service.name,
			serviceDuration: table.service.duration,
			servicePrice: table.service.price
		})
		.from(table.reservation)
		.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id))
		.where(eq(table.reservation.email, email));
}

export async function getReservationByID(id: string) {
	return await db
		.select({
			id: table.reservation.id,
			date: table.reservation.date,
			hour: table.reservation.hour,
			name: table.reservation.name,
			email: table.reservation.email,
			pending: table.reservation.pending,
			serviceName: table.service.name,
			serviceDuration: table.service.duration,
			servicePrice: table.service.price
		})
		.from(table.reservation)
		.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id))
		.where(eq(table.reservation.id, id))
		.get();
}

export async function deleteAllReservationsOfUser(email: string) {
	return await db.delete(table.reservation).where(eq(table.reservation.email, email));
}

export async function updateReservation(id: string) {
	return await db
		.update(table.reservation)
		.set({ pending: false, expiresAt: new Date() })
		.where(eq(table.reservation.id, id))
		.returning()
		.get();
}
