import { Time } from '@internationalized/date';
export const WORKING_HOURS = {
	start: new Time(8),
	end: new Time(18),
	slot: new Time(0, 30)
};

export function getSlots(reservedSlots: string[] | undefined): Slot[] {
	const slots: Slot[] = [];

	let start = WORKING_HOURS.start;
	while (WORKING_HOURS.end.compare(start) > 0) {
		const id = `${start.hour}T${start.minute}`;
		const available = !reservedSlots?.includes(id);
		slots.push({
			time: new Time(start.hour, start.minute),
			available,
			id
		});
		start = start.add({ hours: WORKING_HOURS.slot.hour, minutes: WORKING_HOURS.slot.minute });
	}
	return slots;
}

export type Slot = {
	id: string;
	time: Time;
	available: boolean;
};
