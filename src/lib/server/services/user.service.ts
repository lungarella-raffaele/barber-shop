import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { type RequestEvent } from '@sveltejs/kit';
import { and, count, eq, lt } from 'drizzle-orm';
import { logger } from '../logger';
import { ReservationService } from '@service/reservation.service';
import { err, ok, type Result } from '$lib/modules/result';
import * as T from '../db/schema';
import { hash } from 'argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { DAY_IN_MS } from '$lib/constants';
import { emailSchema, passwordSchema } from '$lib/modules/zod-schemas';

type InsertError =
	| 'already-existing'
	| 'data-required'
	| 'invalid-email'
	| 'invalid-pass'
	| 'generic';

export class UserService {
	async insert(data: {
		email: string;
		password: string;
		name: string;
		phoneNumber: string;
	}): Promise<Result<T.User, InsertError>> {
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
					.insert(T.user)
					.values({
						id: userID,
						email,
						passwordHash,
						name: data.name,
						phoneNumber: data.phoneNumber,
						isAdmin: false,
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

	async get(email: string) {
		const lowercaseEmail = email.toLowerCase();
		return await db.select().from(T.user).where(eq(T.user.email, lowercaseEmail)).get();
	}

	async patchPending(id: string) {
		return await db
			.update(T.user)
			.set({
				verifiedEmail: true
			})
			.where(eq(T.user.id, id))
			.returning()
			.get();
	}

	async patchPassword(passwordHash: string, id: string) {
		return await db
			.update(T.user)
			.set({ passwordHash })
			.where(eq(T.user.id, id))
			.returning()
			.get();
	}

	async patchEmail(id: string, email: string) {
		return await db
			.update(T.user)
			.set({
				email
			})
			.where(eq(T.user.id, id))
			.returning()
			.get();
	}

	async getByID(id: string) {
		try {
			const user = await db.select().from(T.user).where(eq(T.user.id, id));
			return user[0] ?? null;
		} catch (err) {
			logger.error(err);
		}
	}

	async insertSession(session: T.Session) {
		return await db.insert(T.session).values(session);
	}

	async deleteAccount(user: T.User) {
		await this.deleteAllSessionOfUser(user.id);
		await new ReservationService().deleteAll(user.email);
		await this.deleteTokens(user.id);
		return await db.delete(T.user).where(eq(T.user.id, user.id)).returning().get();
	}

	async logout(id: string, event: RequestEvent) {
		await auth.invalidateSession(id);
		auth.deleteSessionTokenCookie(event);
	}

	async deleteTokens(id: string) {
		return await db.delete(T.session).where(eq(T.emailVerification.userID, id));
	}

	async deleteAllSessionOfUser(id: string) {
		return await db.delete(T.session).where(eq(T.session.userID, id));
	}

	async getAllUnverifiedExpiredUsers() {
		const entries = await db
			.select({ count: count() })
			.from(T.user)
			.where(and(eq(T.user.verifiedEmail, false), lt(T.user.expiresAt, new Date())))
			.get();

		return entries?.count;
	}

	async updatePhoneNumber(id: string, phoneNumber: string) {
		return await db
			.update(T.user)
			.set({ phoneNumber: phoneNumber.trim() })
			.where(eq(T.user.id, id));
	}

	async updateName(id: string, name: string) {
		return await db.update(T.user).set({ name: name.trim() }).where(eq(T.user.id, id));
	}

	async updateUserInfo(id: string, name?: string, phoneNumber?: string) {
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
		return await db.update(T.user).set(updateData).where(eq(T.user.id, id));
	}

	async insertEmailVerification(newEmail: string, userID: string) {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 1); // Add one day

		return await db
			.insert(T.emailVerification)
			.values({
				id: crypto.randomUUID(),
				userID,
				expiresAt,
				email: newEmail
			})
			.returning()
			.get();
	}

	async deleteEmailVerification(id: string) {
		return await db.delete(T.emailVerification).where(eq(T.emailVerification.id, id));
	}

	async getEmailVerification(id: string) {
		const _ = await db.select().from(T.emailVerification).where(eq(T.emailVerification.id, id));
		return _[0];
	}

	async insertPasswordRecover(userID: string) {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 1); // Add one day

		return await db
			.insert(T.passwordRecover)
			.values({
				id: crypto.randomUUID(),
				userID,
				expiresAt
			})
			.returning()
			.get();
	}

	async getPasswordRecover(id: string) {
		const _ = await db.select().from(T.passwordRecover).where(eq(T.passwordRecover.id, id));
		return _[0];
	}

	async expirePasswordRecover(id: string) {
		return await db
			.update(T.passwordRecover)
			.set({ expiresAt: null })
			.where(eq(T.passwordRecover.id, id))
			.returning()
			.get();
	}

	async deletePasswordRecover() {
		try {
			return await db
				.delete(T.passwordRecover)
				.where(lt(T.passwordRecover.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired passwords recover records');
			console.error(err);
		}
	}
	async deleteEmailVerifications() {
		try {
			return await db
				.delete(T.emailVerification)
				.where(lt(T.emailVerification.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired verify email records');
			console.error(err);
		}
	}

	async deleteAllExpiredReservations() {
		try {
			return await db.delete(T.reservation).where(lt(T.reservation.expiresAt, new Date()));
		} catch (err) {
			logger.error('Error while removing expired reservations');
			console.error(err);
		}
	}

	async deleteAllExpiredUsers() {
		try {
			return await db
				.delete(T.user)
				.where(and(eq(T.user.verifiedEmail, false), lt(T.user.expiresAt, new Date())));
		} catch (err) {
			logger.error('Error while removing expired users');
			console.error(err);
		}
	}

	private generateUserId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);
		return id;
	}
}
