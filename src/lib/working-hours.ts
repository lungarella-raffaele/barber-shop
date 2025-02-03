import { Time, type DateValue } from '@internationalized/date';
export const WORKING_HOURS = {
	start: new Time(8),
	end: new Time(18),
	slot: new Time(0, 30)
};

export function getSlots(
	date: DateValue | undefined,
	reservedSlots?: string[] | undefined
): Slot[] {
	const slots: Slot[] = [];

	let start = WORKING_HOURS.start;
	while (WORKING_HOURS.end.compare(start) > 0) {
		const time = new Time(start.hour, start.minute).toString();
		const available = !reservedSlots?.includes(time);
		slots.push({
			time,
			available
		});
		start = start.add({ hours: WORKING_HOURS.slot.hour, minutes: WORKING_HOURS.slot.minute });
	}
	return slots;
}

export type Slot = {
	time: string;
	available: boolean;
};
