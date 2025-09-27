import type { DateValue, Time } from '@internationalized/date';
import type { Banner, Shutdown, Reservation, Kind, Session, User } from '../server/db/schema';
export type { Banner, Shutdown as Closure, Reservation, Kind, Session, User };
// You can also add client-specific utility types here
export type UserWithoutPassword = Omit<User, 'passwordHash'>;
export type KindSummary = Pick<Kind, 'id' | 'name' | 'price' | 'duration'>;
export type BusinessHours = {
	start: Time;
	end: Time;
};
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
