import type { DateValue, Time } from '@internationalized/date';
import type { Banner, Shutdown, Reservation, Kind, Session, User } from '../server/db/schema';
export type { Banner, Shutdown as Closure, Reservation, Kind as Service, Session, User };
// You can also add client-specific utility types here
export type UserWithoutPassword = Omit<User, 'passwordHash'>;
export type ServiceSummary = Pick<Kind, 'id' | 'name' | 'price' | 'duration'>;
export type BusinessHours = {
	start: Time;
	end: Time;
};
export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
export type Error = 'conflict' | 'server_error' | 'invalid_input' | 'expired';
export type ReservedSlot = {
	date: DateValue;
	start: Time;
	duration: Time;
};
export type Slot = {
	start: Time;
	available: boolean;
	invalid: boolean;
	past: boolean;
};
