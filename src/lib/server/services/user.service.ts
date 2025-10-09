import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';
import { and, count, eq, lt } from 'drizzle-orm';
import { logger } from '../logger';
import { ReservationService } from '@service/reservation.service';
import { err, ok, type Result } from '$lib/modules/result';
import * as table from '../db/schema';
import { hash } from 'argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { DAY_IN_MS } from '$lib/constants';
import { emailSchema, passwordSchema } from '$lib/modules/zod-schemas';
import type { DBSession, DBUser, Staff, User, UserSession } from '@types';

type InsertError =
	| 'already-existing'
	| 'data-required'
	| 'invalid-email'
	| 'invalid-pass'
	| 'generic';

export class UserService {
	async insertUser(data: {
		email: string;
		password: string;
		name: string;
		phoneNumber: string;
	}): Promise<Result<DBUser, InsertError>> {
		try {
			if (!data.email || !data.password) {
				return err('data-required');
			}

			const email = data.email.toLowerCase();

			const isPresent = await this.get(email);
			if (isPresent) {
				return err('already-existing');
			}

			const validEmail = emailSchema.safeParse(email);

			if (!validEmail.success) {
				return err('invalid-email');
			}

			const validPassword = passwordSchema.safeParse(data.password);
			if (!validPassword.success) {
				return err('invalid-pass');
			}

			const passwordHash = await hash(data.password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				parallelism: 1
			});

			const userID = this.generateUserId();

			return ok(
				await db
					.insert(table.user)
					.values({
						id: userID,
						email,
						passwordHash,
						name: data.name,
						phoneNumber: data.phoneNumber,
						verifiedEmail: false,
						expiresAt: new Date(Date.now() + DAY_IN_MS)
					})
					.returning()
					.get()
			);
		} catch {
			return err('generic');
		}
	}

	async get(email: string): Promise<User | null> {
		try {
			const lowercaseEmail = email.toLowerCase();
			const user = await db
				.select()
				.from(table.user)
				.where(eq(table.user.email, lowercaseEmail))
				.get();

			if (!user) {
				logger.warn('User not found');
				return null;
			}

			const staff = await db
				.select()
				.from(table.staff)
				.where(eq(table.staff.userID, user.id))
				.get();

			if (!staff) {
				return {
					role: 'user',
					data: user
				};
			} else {
				return {
					role: 'staff',
					data: { ...user, avatar: staff.avatar }
				};
			}
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async patchPending(id: string) {
		try {
			return await db
				.update(table.user)
				.set({
					verifiedEmail: true
				})
				.where(eq(table.user.id, id))
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async patchPassword(passwordHash: string, id: string) {
		try {
			return await db
				.update(table.user)
				.set({ passwordHash })
				.where(eq(table.user.id, id))
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async patchEmail(id: string, email: string) {
		try {
			return await db
				.update(table.user)
				.set({
					email
				})
				.where(eq(table.user.id, id))
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getByID(id: string): Promise<User | null> {
		try {
			const result = await db
				.select()
				.from(table.user)
				.leftJoin(table.staff, eq(table.staff.userID, table.user.id))
				.where(eq(table.user.id, id))
				.get();

			if (!result) {
				logger.warn('User not found');
				return null;
			}

			if (!result.staff) {
				return {
					role: 'user',
					data: result.user
				};
			} else {
				return {
					role: 'staff',
					data: { ...result.user, avatar: result.staff.avatar }
				};
			}
		} catch (err) {
			logger.error(err);
			return null;
		}
	}

	async insertSession(session: table.DBSession) {
		try {
			return await db.insert(table.session).values(session);
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async deleteAccount(user: table.DBUser) {
		try {
			await this.deleteAllSessionOfUser(user.id);
			await new ReservationService().deleteAll(user.email);
			await this.deleteTokens(user.id);
			return await db.delete(table.user).where(eq(table.user.id, user.id)).returning().get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async logout(id: string, event: RequestEvent) {
		await auth.invalidateSession(id);
		auth.deleteSessionTokenCookie(event);
	}

	async deleteTokens(id: string) {
		try {
			return await db.delete(table.session).where(eq(table.emailVerification.userID, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async deleteAllSessionOfUser(id: string) {
		try {
			return await db.delete(table.session).where(eq(table.session.userID, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async countExpired() {
		try {
			const entries = await db
				.select({ count: count() })
				.from(table.user)
				.where(
					and(eq(table.user.verifiedEmail, false), lt(table.user.expiresAt, new Date()))
				)
				.get();

			return entries?.count;
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async updatePhoneNumber(id: string, phoneNumber: string) {
		try {
			return await db
				.update(table.user)
				.set({ phoneNumber: phoneNumber.trim() })
				.where(eq(table.user.id, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async updateName(id: string, name: string) {
		try {
			return await db
				.update(table.user)
				.set({ name: name.trim() })
				.where(eq(table.user.id, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async updateUserInfo(id: string, name?: string, phoneNumber?: string) {
		try {
			const updateData: Record<string, string> = {};

			if (name?.trim()) {
				updateData.name = name;
			}

			if (phoneNumber?.trim()) {
				updateData.phoneNumber = phoneNumber;
			}

			if (Object.keys(updateData).length === 0) {
				// Nothing to update
				return;
			}
			return await db.update(table.user).set(updateData).where(eq(table.user.id, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async insertEmailVerification(newEmail: string, userID: string) {
		try {
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 1); // Add one day

			return await db
				.insert(table.emailVerification)
				.values({
					id: crypto.randomUUID(),
					userID,
					expiresAt,
					email: newEmail
				})
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async deleteEmailVerification(id: string) {
		try {
			return await db
				.delete(table.emailVerification)
				.where(eq(table.emailVerification.id, id));
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getEmailVerification(id: string) {
		try {
			return await db
				.select()
				.from(table.emailVerification)
				.where(eq(table.emailVerification.id, id))
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async insertPassRecover(userID: string) {
		try {
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 1); // Add one day

			return await db
				.insert(table.passwordRecover)
				.values({
					id: crypto.randomUUID(),
					userID,
					expiresAt
				})
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getPasswordRecover(id: string) {
		try {
			return await db
				.select()
				.from(table.passwordRecover)
				.where(eq(table.passwordRecover.id, id))
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async expirePasswordRecover(id: string) {
		try {
			return await db
				.update(table.passwordRecover)
				.set({ expiresAt: null })
				.where(eq(table.passwordRecover.id, id))
				.returning()
				.get();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async deletePasswordRecover() {
		try {
			return await db
				.delete(table.passwordRecover)
				.where(lt(table.passwordRecover.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired passwords recover records');
			console.error(err);
		}
	}
	async deleteEmailVerifications() {
		try {
			return await db
				.delete(table.emailVerification)
				.where(lt(table.emailVerification.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired verify email records');
			console.error(err);
		}
	}

	async deleteAllExpiredReservations() {
		try {
			return await db
				.delete(table.reservation)
				.where(lt(table.reservation.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired reservations');
			console.error(err);
		}
	}

	async deleteAllExpiredUsers() {
		try {
			return await db
				.delete(table.user)
				.where(
					and(eq(table.user.verifiedEmail, false), lt(table.user.expiresAt, new Date()))
				);
		} catch (err) {
			logger.error('Error while removing expired users');
			console.error(err);
		}
	}

	async getUserSession(sessionID: string): Promise<UserSession | null> {
		try {
			const [result] = await db
				.select({
					user: table.user,
					staff: table.staff,
					session: table.session
				})
				.from(table.session)
				.innerJoin(table.user, eq(table.session.userID, table.user.id))
				.leftJoin(table.staff, eq(table.staff.userID, table.user.id))
				.where(eq(table.session.id, sessionID));

			if (!result.staff) {
				const user: User & { session: DBSession } = {
					role: 'user',
					data: result.user,
					session: result.session
				};
				return { user, session: result.session };
			} else {
				const staff: User & { session: DBSession } = {
					role: 'staff',
					data: { ...result.user, avatar: result.staff.avatar },
					session: result.session
				};
				return { user: staff, session: result.session };
			}
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	async getAllStaff(): Promise<Staff[] | null> {
		try {
			const result = await db
				.select({
					name: table.user.name,
					id: table.staff.userID,
					avatar: table.staff.avatar
				})
				.from(table.staff)
				.innerJoin(table.user, eq(table.user.id, table.staff.userID));

			return result;
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	private generateUserId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}
}
