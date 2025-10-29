import { logger } from '../logger';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { EmailVerificationService } from './email-verification.service';
import { PasswordRecoverService } from './password-recover.service';
import { ReservationService } from './reservation.service';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq, isNotNull, lt } from 'drizzle-orm';

export class CleanupService {
	async deleteExpiredItems() {
		try {
			const reservationService = new ReservationService();
			const emailVerificationService = new EmailVerificationService();
			const passwordRecoverService = new PasswordRecoverService();

			// Delete expired items in parallel
			await Promise.all([
				reservationService.deleteAllExpired(),
				emailVerificationService.deleteAllExpired(),
				passwordRecoverService.deleteAllExpired()
			]);

			// Delete expired users (needs to be done after other cleanups)
			await this.deleteExpiredUsers();
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	private async deleteExpiredUsers() {
		try {
			const sessionService = new SessionService();
			const passwordRecoverService = new PasswordRecoverService();
			const reservationService = new ReservationService();

			// First, get all expired users
			const expiredUsers = await db
				.select({ id: table.user.id, email: table.user.email })
				.from(table.user)
				.where(
					and(
						eq(table.user.verifiedEmail, false),
						isNotNull(table.user.expiresAt),
						lt(table.user.expiresAt, new Date())
					)
				);

			if (expiredUsers.length === 0) {
				return;
			}

			// Delete related records for each expired user
			for (const user of expiredUsers) {
				await sessionService.deleteAllByUserID(user.id);
				await passwordRecoverService.deleteByUserID(user.id);
				await reservationService.deleteAll(user.email);
			}

			// Finally, delete the users
			await new UserService().deleteAllExpired();
		} catch (err) {
			logger.error('Error while removing expired users');
			console.error(err);
		}
	}
}
