import { logger } from '../logger';
import { UserService } from './user.service';

export class CleanupService {
	async deleteExpiredItems() {
		try {
			const users = new UserService();
			await Promise.all([
				users.deleteAllExpiredReservations(),
				users.deleteAllExpiredUsers(),
				users.deleteEmailVerifications(),
				users.deletePasswordRecover()
			]);
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
