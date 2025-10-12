import { db } from '$lib/server/db';
import type { DBReservation, DBUser } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { and, count, eq, gt, lt, sql } from 'drizzle-orm';
import { logger } from '../logger';
import { err, ok, type Result } from '$lib/modules/result';
import { LOCK_DURATION } from '$lib/constants';
import type { AnonymousData, Reservation, StaffData, UsualData } from '@types';
import { anonymousUserSchema, staffUserSchema, usualUserSchema } from '@schema';
import { alias } from 'drizzle-orm/sqlite-core/alias';

type InsertError = 'conflict' | 'invalid-data' | 'server-err';

export class ReservationService {
	private getReservations() {
		const staffUser = alias(table.user, 'staffUser');
		const customerUser = alias(table.user, 'customerUser');

		return db
			.select({
				id: table.reservation.id,
				date: table.reservation.date,
				hour: table.reservation.hour,
				name: table.reservation.name,
				email: table.reservation.email,
				pending: table.reservation.pending,
				expiresAt: table.reservation.expiresAt,
				staff: {
					id: staffUser.id,
					name: staffUser.name
				},
				kind: {
					duration: table.kind.duration,
					name: table.kind.name,
					price: table.kind.price
				}
			})
			.from(table.reservation)
			.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			.innerJoin(table.staff, eq(table.reservation.staffID, table.staff.userID))
			.innerJoin(staffUser, eq(table.staff.userID, staffUser.id))
			.leftJoin(customerUser, eq(table.reservation.email, customerUser.email));
	}

	async insertByUser(data: UsualData, user: DBUser): Promise<Result<DBReservation, InsertError>> {
		try {
			const schema = usualUserSchema.safeParse({ ...data, date: data.date?.toString() });

			if (!schema.success) {
				logger.error(schema.error.issues);
				return err('invalid-data');
			}

			const { date, hour, kind, staff } = schema.data;

			const expiresAt = new Date(date);
			expiresAt.setDate(expiresAt.getDate() + 1);
			expiresAt.setHours(23, 59, 59, 999);

			if (!this.checkAvailability(date, hour)) {
				logger.error('Reservation already present');
				return err('conflict');
			}

			const reservation: table.DBReservation = {
				date,
				hour,
				id: crypto.randomUUID(),
				kindID: kind,
				name: user.name,
				phoneNumber: user.phoneNumber,
				email: user.email,
				pending: false,
				expiresAt,
				staffID: staff
			};

			const queryRes = await db
				.insert(table.reservation)
				.values(reservation)
				.returning()
				.get();

			if (!queryRes) {
				logger.error('Could not insert reservation');
				return err('server-err');
			}

			return ok(queryRes);
		} catch (e) {
			logger.error('Error while adding usual user', e);
			return err('server-err');
		}
	}

	async insertByAnonymous(data: AnonymousData): Promise<Result<DBReservation, InsertError>> {
		try {
			const schema = anonymousUserSchema.safeParse({
				name: data.name,
				email: data.email,
				date: data.date?.toString(),
				hour: data.hour,
				kind: data.kind,
				staff: data.staff
			});

			if (!schema.success) {
				const { path } = schema.error.issues[0];
				logger.warn({ reason: path }, 'Could not create reservation');
				return err('invalid-data');
			}

			if (!this.checkAvailability(schema.data.date, data.hour)) {
				return err('conflict');
			}

			const reservation: table.DBReservation = {
				date: schema.data.date,
				hour: schema.data.hour,
				id: crypto.randomUUID(),
				kindID: schema.data.kind,
				name: schema.data.name,
				phoneNumber: schema.data.phone ?? null,
				email: schema.data.email,
				expiresAt: new Date(Date.now() + LOCK_DURATION),
				pending: true,
				staffID: schema.data.staff
			};

			const queryRes = await db.insert(table.reservation).values(reservation).returning();

			const res = queryRes[0];
			if (!res) {
				return err('server-err');
			}

			return ok(res);
		} catch (e) {
			logger.error(e);
			return err('server-err');
		}
	}

	async insertByStaff(
		data: StaffData,
		user: DBUser,
		alternativeName: string
	): Promise<Result<DBReservation, InsertError>> {
		try {
			const schema = staffUserSchema.safeParse({
				...data,
				name: alternativeName ?? 'Inserito da staff',
				date: data.date?.toString()
			});

			if (!schema.success) {
				logger.error(schema.error.issues);
				return err('invalid-data');
			}

			const { date, hour, kind, staff, name } = schema.data;

			const expiresAt = new Date(date);
			expiresAt.setDate(expiresAt.getDate() + 1); // Add one day
			expiresAt.setHours(23, 59, 59, 999); // Set to end of the day

			if (!this.checkAvailability(date, hour)) {
				return err('conflict');
			}

			const reservation: table.DBReservation = {
				date,
				hour,
				id: crypto.randomUUID(),
				kindID: kind,
				name,
				email: user.email,
				pending: false,
				expiresAt,
				staffID: staff,
				phoneNumber: null
			};

			const queryRes = await db.insert(table.reservation).values(reservation).returning();

			const res = queryRes[0];
			if (!res) {
				return err('server-err');
			}

			return ok(res);
		} catch (e) {
			logger.error('Error while adding usual user', e);
			return err('server-err');
		}
	}

	async getAll(): Promise<Reservation[] | null> {
		try {
			return await this.getReservations().where(gt(table.reservation.expiresAt, new Date()));
			// return await db
			// 	.select({
			// 		id: table.reservation.id,
			// 		date: table.reservation.date,
			// 		hour: table.reservation.hour,
			// 		name: table.reservation.name,
			// 		email: table.reservation.email,
			// 		staff: {
			// 			id: staffUser.id,
			// 			name: staffUser.name
			// 		},
			// 		kind: {
			// 			duration: table.kind.duration,
			// 			name: table.kind.name,
			// 			price: table.kind.price
			// 		}
			// 	})
			// 	.from(table.reservation)
			// 	.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			// 	.innerJoin(table.staff, eq(table.reservation.staffID, table.staff.userID))
			// 	.innerJoin(staffUser, eq(table.staff.userID, staffUser.id))
			// 	.leftJoin(customerUser, eq(table.reservation.email, customerUser.email))
			// 	.where(gt(table.reservation.expiresAt, new Date()));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getTodayReservations(date: string): Promise<Reservation[] | null> {
		try {
			return await this.getReservations().where(
				and(eq(table.reservation.date, date), eq(table.reservation.pending, false))
			);

			// const result = await db
			// 	.select({
			// 		id: table.reservation.id,
			// 		date: table.reservation.date,
			// 		hour: table.reservation.hour,
			// 		name: table.reservation.name,
			// 		pending: table.reservation.pending,
			// 		email: table.reservation.email,
			// 		staff: table.staff.userID,
			// 		kind: {
			// 			name: table.kind.name,
			// 			duration: table.kind.duration,
			// 			price: table.kind.price
			// 		}
			// 	})
			// 	.from(table.reservation)
			// 	.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			// 	.innerJoin(table.staff, eq(table.staff.userID, table.user.id))
			// 	.leftJoin(table.user, eq(table.reservation.email, table.user.email))
			// 	.where(and(eq(table.reservation.date, date), eq(table.reservation.pending, false)));

			// return result.map((entry) => ({
			// 	...entry,
			// 	fromAdmin: !!entry.staff,
			// 	staffID: entry.staff
			// }));
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getByUser(email: string) {
		try {
			return await this.getReservations().where(eq(table.reservation.email, email));
			// return await db
			// 	.select({
			// 		id: table.reservation.id,
			// 		date: table.reservation.date,
			// 		hour: table.reservation.hour,
			// 		name: table.reservation.name,
			// 		email: table.reservation.email,
			// 		kindName: table.kind.name,
			// 		kindDuration: table.kind.duration,
			// 		kindPrice: table.kind.price
			// 	})
			// 	.from(table.reservation)
			// 	.innerJoin(table.kind, eq(table.reservation.kindID, table.kind.id))
			// 	.where(eq(table.reservation.email, email));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getByID(id: string): Promise<Reservation | null> {
		try {
			return (await this.getReservations().where(eq(table.reservation.id, id)).get()) ?? null;
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async delete(id: string) {
		try {
			return await db
				.delete(table.reservation)
				.where(eq(table.reservation.id, id))
				.returning();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async deleteAll(email: string) {
		try {
			return await db.delete(table.reservation).where(eq(table.reservation.email, email));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	/**
	 * Updates the reservation to expire after the day of the reservation
	 */
	async updateExpiration(id: string) {
		try {
			return await db
				.update(table.reservation)
				.set({
					pending: false,
					expiresAt: sql`strftime('%s', datetime(${table.reservation.date}, '+1 day'))`
				})
				.where(eq(table.reservation.id, id))
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
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

	async countExpired() {
		try {
			const entries = await db
				.select({ count: count() })
				.from(table.reservation)
				.where(lt(table.reservation.expiresAt, new Date()))
				.get();

			return entries?.count;
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
