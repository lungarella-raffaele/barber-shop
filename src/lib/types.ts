import type { Time } from '@internationalized/date';

/**
 * A slot can correspond to a single or multiple slots
 */
export type Slot = {
	startingTime: string;
	available: boolean;
	hasEnoughFollowingSlots: boolean | undefined;
};
export type BusinessHours = {
	start: Time;
	end: Time;
};

export type Reservation = {
	date: string;
	startingTime: string;
	duration: Time;
};
