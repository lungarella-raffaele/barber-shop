import { UserService } from './user.service';

export class CleanupService {
	async deleteExpiredItems() {
		const users = new UserService();
		await users.deleteAllExpiredReservations();
		await users.deleteAllExpiredUsers();
		await users.deleteEmailVerifications();
		await users.deletePasswordRecover();
	}
}
