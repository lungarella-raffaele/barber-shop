import type { Result } from '$lib/models/types';
import { db } from '$lib/server/db';
import type { Reservation } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { and, count, eq, gt, lt, sql } from 'drizzle-orm';
import { logger } from '../logger';

export class ReservationService {
	async insert(reservation: Reservation): Promise<Result<Reservation>> {
		if (!this.checkAvailability(reservation.date, reservation.hour)) {
			return { ok: false, error: 'conflict' };
		}

		const existing = await db
			.select()
			.from(table.reservation)
			.where(
				and(
					eq(table.reservation.date, reservation.date),
					eq(table.reservation.hour, reservation.hour),
					eq(table.reservation.pending, false),
					gt(table.reservation.expiresAt, new Date())
				)
			);

		if (existing.length > 0) {
			logger.error('Conflict while creating reservation');
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

	async delete(id: string) {
		return await db.delete(table.reservation).where(eq(table.reservation.id, id)).returning();
	}

	/**
	 * @returns All the non-expired reservations
	 */
	async get() {
		return await db
			.select({
				date: table.reservation.date,
				startingTime: table.reservation.hour,
				duration: table.kind.duration
			})
			.from(table.reservation)
			.where(gt(table.reservation.expiresAt, new Date()))
			.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id));
	}

	async getAll() {
		return await db
			.select({
				id: table.reservation.id,
				date: table.reservation.date,
				hour: table.reservation.hour,
				name: table.reservation.name,
				email: table.reservation.email,
				serviceName: table.kind.name,
				serviceDuration: table.kind.duration,
				servicePrice: table.kind.price
			})
			.from(table.reservation)
			.where(eq(table.reservation.pending, false))
			.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id));
	}

	async getToday(date: string) {
		try {
			const reservations = await db
				.select({
					id: table.reservation.id,
					date: table.reservation.date,
					hour: table.reservation.hour,
					name: table.reservation.name,
					pending: table.reservation.pending,
					email: table.reservation.email,
					serviceName: table.kind.name,
					serviceDuration: table.kind.duration,
					servicePrice: table.kind.price,
					isAdmin: table.user.isAdmin
				})
				.from(table.reservation)
				.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
				.leftJoin(table.user, eq(table.reservation.email, table.user.email))
				.where(and(eq(table.reservation.date, date), eq(table.reservation.pending, false)));

			return reservations;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getByUser(email: string) {
		return await db
			.select({
				id: table.reservation.id,
				date: table.reservation.date,
				hour: table.reservation.hour,
				name: table.reservation.name,
				email: table.reservation.email,
				serviceName: table.kind.name,
				serviceDuration: table.kind.duration,
				servicePrice: table.kind.price
			})
			.from(table.reservation)
			.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			.where(eq(table.reservation.email, email));
	}

	async getByID(id: string) {
		return await db
			.select({
				id: table.reservation.id,
				date: table.reservation.date,
				hour: table.reservation.hour,
				name: table.reservation.name,
				email: table.reservation.email,
				pending: table.reservation.pending,
				expiresAt: table.reservation.expiresAt,
				serviceName: table.kind.name,
				serviceDuration: table.kind.duration,
				servicePrice: table.kind.price
			})
			.from(table.reservation)
			.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			.where(eq(table.reservation.id, id))
			.get();
	}

	async deleteAll(email: string) {
		return await db.delete(table.reservation).where(eq(table.reservation.email, email));
	}

	/**
	 * Updates the reservation to expire after the day of the reservation
	 */
	async updateExpiration(id: string) {
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
	async checkAvailability(date: string, hour: string): Promise<boolean> {
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

	async getAllExpired() {
		const entries = await db
			.select({ count: count() })
			.from(table.reservation)
			.where(lt(table.reservation.expiresAt, new Date()))
			.get();

		return entries?.count;
	}
}
