import { UserService } from './user.service';

export async function deleteExpiredItems() {
	const user = new UserService();
	await user.deleteAllExpiredReservations();
	await user.deleteAllExpiredUsers();
	await user.deleteEmailVerifications();
	await user.deletePasswordRecover();
}
