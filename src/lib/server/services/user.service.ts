import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { type RequestEvent } from '@sveltejs/kit';
import { and, count, eq, lt } from 'drizzle-orm';
import { logger } from '../logger';
import { ReservationService } from './reservation.service';
import { err, ok, type Result } from '$lib/result';
import * as T from '../db/schema';

export class UserService {
	async insert(user: table.User): Promise<Result<T.User, string>> {
		try {
			return ok(
				await db
					.insert(table.user)
					.values({ ...user, email: user.email.toLowerCase() })
					.returning()
					.get()
			);
		} catch {
			return err('Could not insert user');
		}
	}

	async get(email: string) {
		const lowercaseEmail = email.toLowerCase();
		return await db.select().from(table.user).where(eq(table.user.email, lowercaseEmail)).get();
	}

	async patchPending(id: string) {
		return await db
			.update(table.user)
			.set({
				verifiedEmail: true
			})
			.where(eq(table.user.id, id))
			.returning()
			.get();
	}

	async patchPassword(passwordHash: string, id: string) {
		return await db
			.update(table.user)
			.set({ passwordHash })
			.where(eq(table.user.id, id))
			.returning()
			.get();
	}

	async patchEmail(id: string, email: string) {
		return await db
			.update(table.user)
			.set({
				email
			})
			.where(eq(table.user.id, id))
			.returning()
			.get();
	}

	async getByID(id: string) {
		try {
			const user = await db.select().from(table.user).where(eq(table.user.id, id));
			return user[0] ?? null;
		} catch (err) {
			logger.error(err);
		}
	}

	async insertSession(session: table.Session) {
		return await db.insert(table.session).values(session);
	}

	async deleteAccount(user: table.User) {
		await this.deleteAllSessionOfUser(user.id);
		await new ReservationService().deleteAll(user.email);
		await this.deleteTokens(user.id);
		return await db.delete(table.user).where(eq(table.user.id, user.id)).returning().get();
	}

	async logout(id: string, event: RequestEvent) {
		await auth.invalidateSession(id);
		auth.deleteSessionTokenCookie(event);
	}

	async deleteTokens(id: string) {
		return await db.delete(table.session).where(eq(table.emailVerification.userID, id));
	}

	async deleteAllSessionOfUser(id: string) {
		return await db.delete(table.session).where(eq(table.session.userID, id));
	}

	async getAllUnverifiedExpiredUsers() {
		const entries = await db
			.select({ count: count() })
			.from(table.user)
			.where(and(eq(table.user.verifiedEmail, false), lt(table.user.expiresAt, new Date())))
			.get();

		return entries?.count;
	}

	async updatePhoneNumber(id: string, phoneNumber: string) {
		return await db
			.update(table.user)
			.set({ phoneNumber: phoneNumber.trim() })
			.where(eq(table.user.id, id));
	}

	async updateName(id: string, name: string) {
		return await db.update(table.user).set({ name: name.trim() }).where(eq(table.user.id, id));
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
		return await db.update(table.user).set(updateData).where(eq(table.user.id, id));
	}

	async insertEmailVerification(newEmail: string, userID: string) {
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
	}

	async deleteEmailVerification(id: string) {
		return await db.delete(table.emailVerification).where(eq(table.emailVerification.id, id));
	}

	async getEmailVerification(id: string) {
		const _ = await db
			.select()
			.from(table.emailVerification)
			.where(eq(table.emailVerification.id, id));
		return _[0];
	}

	async insertPasswordRecover(userID: string) {
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
	}

	async getPasswordRecover(id: string) {
		const _ = await db
			.select()
			.from(table.passwordRecover)
			.where(eq(table.passwordRecover.id, id));
		return _[0];
	}

	async expirePasswordRecover(id: string) {
		return await db
			.update(table.passwordRecover)
			.set({ expiresAt: null })
			.where(eq(table.passwordRecover.id, id))
			.returning()
			.get();
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
}
