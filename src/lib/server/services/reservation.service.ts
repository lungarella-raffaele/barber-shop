import { db } from '$lib/server/db';
import type { Reservation, User } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { and, count, eq, gt, lt, sql } from 'drizzle-orm';
import { logger } from '../logger';
import { reservationSchema } from '$lib/modules/zod-schemas';
import { err, ok, type Result } from '$lib/modules/result';
import { LOCK_DURATION } from '$lib/constants';

type InsertError =
	| 'no-date'
	| 'no-kind'
	| 'conflict'
	| 'invalid-email'
	| 'invalid-data'
	| 'db-error';

export class ReservationService {
	async insertByUser(
		data: {
			hour: string;
			date: string;
			kind: string;
		},
		user: User
	): Promise<Result<Reservation, InsertError>> {
		const schema = reservationSchema.safeParse({
			name: user.name,
			email: user.email,
			hour: data.hour,
			kind: data.kind,
			date: data.date
		});

		if (!schema.success) {
			const { path } = schema.error.issues[0];
			logger.warn({ reason: path }, 'Could not create reservation');

			if (path.includes('date') || path.includes('hour')) {
				return err('no-date');
			} else if (path.includes('kind')) {
				return err('no-kind');
			} else if ((path.includes('email') || path.includes('name')) && !user) {
				return err('invalid-email');
			} else {
				return err('invalid-data');
			}
		}

		const expiresAt = new Date(data.date);
		expiresAt.setDate(expiresAt.getDate() + 1); // Add one day
		expiresAt.setHours(23, 59, 59, 999); // Set to end of the day

		if (!this.checkAvailability(data.date, data.hour)) {
			return err('conflict');
		}

		const reservation: table.Reservation = {
			date: data.date,
			hour: data.hour,
			id: crypto.randomUUID(),
			kindID: data.kind,
			name: user.name,
			phoneNumber: user.phoneNumber,
			email: user.email,
			pending: false,
			expiresAt
		};

		const queryRes = await db.insert(table.reservation).values(reservation).returning();

		const res = queryRes[0];
		if (!res) {
			return err('db-error');
		}

		return ok(res);
	}

	async insertByUnkown(data: {
		name: string;
		hour: string;
		kind: string;
		email: string;
		date: string;
		phoneNumber: string;
	}) {
		const schema = reservationSchema.safeParse({
			name: data.name,
			hour: data.hour,
			kind: data.kind,
			email: data.email,
			date: data.date
		});

		if (!schema.success) {
			const { path } = schema.error.issues[0];
			logger.warn({ reason: path }, 'Could not create reservation');

			if (path.includes('date') || path.includes('hour')) {
				return err('no-date');
			} else if (path.includes('kind')) {
				return err('no-kind');
			} else if (path.includes('email') || path.includes('name')) {
				return err('invalid-email');
			} else {
				return err('invalid-data');
			}
		}

		if (!this.checkAvailability(data.date, data.hour)) {
			return err('conflict');
		}

		const reservation: table.Reservation = {
			date: data.date,
			hour: data.hour,
			id: crypto.randomUUID(),
			kindID: data.kind,
			name: data.name,
			phoneNumber: data.phoneNumber,
			email: data.email,
			expiresAt: new Date(Date.now() + LOCK_DURATION),
			pending: true
		};

		const queryRes = await db.insert(table.reservation).values(reservation).returning();

		const res = queryRes[0];
		if (!res) {
			return err('db-error');
		}

		return ok(res);
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
				kindName: table.kind.name,
				kindDuration: table.kind.duration,
				kindPrice: table.kind.price
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
					kindName: table.kind.name,
					kindDuration: table.kind.duration,
					kindPrice: table.kind.price,
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
				kindName: table.kind.name,
				kindDuration: table.kind.duration,
				kindPrice: table.kind.price
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
				kindName: table.kind.name,
				kindDuration: table.kind.duration,
				kindPrice: table.kind.price
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
						eq(table.reservation.pending, false),
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
