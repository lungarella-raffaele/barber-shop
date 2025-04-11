import type { DateValue, Time } from '@internationalized/date';

/**
 * A slot can correspond to a single or multiple slots
 */
export type Slot = {
	start: Time;
	available: boolean;
	invalid: boolean;
	past: boolean;
};
export type BusinessHours = {
	start: Time;
	end: Time;
};

export type Reservation = {
	date: DateValue;
	start: Time;
	duration: Time;
};
