import { Time } from '@internationalized/date';
export const WORKING_HOURS = {
	start: new Time(8),
	end: new Time(18),
	slot: new Time(0, 30)
};

export type Slot = {
	time: string;
	available: boolean;
};
