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

export function getWorkingHours(): string[] {
	const times: string[] = [];
	let curr = WORKING_HOURS.start;
	while (WORKING_HOURS.end.compare(curr) > 0) {
		times.push(curr.toString());
		curr = curr.add({ hours: WORKING_HOURS.slot.hour, minutes: WORKING_HOURS.slot.minute });
	}
	return times;
}
