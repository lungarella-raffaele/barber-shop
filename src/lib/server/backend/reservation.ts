import type { Result } from '$lib/models/types';
import { db } from '$lib/server/db';
import type { Reservation } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { and, count, eq, gt, lt, sql } from 'drizzle-orm';
import { logger } from '../logger';

export async function insertReservation(reservation: Reservation): Promise<Result<Reservation>> {
	if (!checkAvailability(reservation.date, reservation.hour)) {
		return { ok: false, error: 'conflict' };
	}

	const queryRes = await db
		.insert(table.reservation)
		.values({ ...reservation })
		.returning();

	const res = queryRes[0];
	if (!res) {
		logger.error('Could not insert a reservation');
		return { ok: false, error: 'server_error' };
	}
	logger.info('Reservation created successfully');
	return { ok: true, value: res };
}

export async function deleteReservation(id: string) {
	return await db.delete(table.reservation).where(eq(table.reservation.id, id)).returning();
}

/**
 * @returns All the non-expired reservations
 */
export async function getReservations() {
	return await db
		.select({
			date: table.reservation.date,
			startingTime: table.reservation.hour,
			duration: table.service.duration
		})
		.from(table.reservation)
		.where(gt(table.reservation.expiresAt, new Date()))
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
	try {
		const reservations = await db
			.select({
				id: table.reservation.id,
				date: table.reservation.date,
				hour: table.reservation.hour,
				name: table.reservation.name,
				pending: table.reservation.pending,
				email: table.reservation.email,
				serviceName: table.service.name,
				serviceDuration: table.service.duration,
				servicePrice: table.service.price,
				isAdmin: table.user.isAdmin
			})
			.from(table.reservation)
			.innerJoin(table.service, eq(table.reservation.serviceID, table.service.id))
			.leftJoin(table.user, eq(table.reservation.email, table.user.email))
			.where(and(eq(table.reservation.date, date), eq(table.reservation.pending, false)));

		return reservations;
	} catch (err) {
		console.error(err);
		return null;
	}
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
			expiresAt: table.reservation.expiresAt,
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

/**
 * Updates the reservation to expire after the day of the reservation
 */
export async function updateReservationExpiration(id: string) {
	return await db
		.update(table.reservation)
		.set({
			pending: false,
			expiresAt: sql`strftime('%s', datetime(${table.reservation.date}, '+1 day'))`
		})
		.where(eq(table.reservation.id, id))
		.returning()
		.get();
}

/**
 * Checks if the following date and hour is already present in db.
 * If present checks if the reservation is expired
 */
export async function checkAvailability(date: string, hour: string): Promise<boolean> {
	try {
		const result = await db
			.select({ count: count() })
			.from(table.reservation)
			.where(
				and(
					eq(table.reservation.date, date),
					eq(table.reservation.hour, hour),
					lt(table.reservation.expiresAt, new Date())
				)
			);

		if (result && result.length > 0) {
			return result[0].count === 0;
		} else {
			return true;
		}
	} catch (error) {
		console.error('Error checking reservation:', error);
		return false;
	}
}

export async function getAllExpiredReservations() {
	const entries = await db
		.select({ count: count() })
		.from(table.reservation)
		.where(lt(table.reservation.expiresAt, new Date()))
		.get();

	return entries?.count;
}
