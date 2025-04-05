import { getDayOfWeek, parseTime, Time, type DateValue } from '@internationalized/date';
import { Day } from './enums/days';

export const SlotDuration = new Time(0, 30);
export type Slot = {
	time: string;
	available: boolean;
};
type BusinessHours = {
	start: Time;
	end: Time;
};

/**
 * The following map has all the info for the normal working hours
 * Hours
 * Monday 2 PM – 7 PM
 * Tuesday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Wednesday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Thursday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Friday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Saturday 10 AM – 3 PM
 */
export const WorkingHours = new Map<Day, BusinessHours[]>([
	[
		Day.MONDAY,
		[
			{
				start: new Time(14),
				end: new Time(19)
			}
		]
	],
	[
		Day.TUESDAY,
		[
			{
				start: new Time(9),
				end: new Time(13)
			},
			{
				start: new Time(14),
				end: new Time(18, 30)
			}
		]
	],
	[
		Day.WEDNESDAY,
		[
			{
				start: new Time(9),
				end: new Time(13)
			},
			{
				start: new Time(14),
				end: new Time(18, 30)
			}
		]
	],
	[
		Day.THURSDAY,
		[
			{
				start: new Time(9),
				end: new Time(13)
			},

			{
				start: new Time(14),
				end: new Time(18, 30)
			}
		]
	],
	[
		Day.FRIDAY,
		[
			{
				start: new Time(9),
				end: new Time(13)
			},

			{
				start: new Time(14),
				end: new Time(18, 30)
			}
		]
	],
	[
		Day.SATURDAY,
		[
			{
				start: new Time(10),
				end: new Time(15)
			}
		]
	]
]);

export type Reservation = {
	date: string;
	startingTime: string;
	duration: Time;
};

export function getSlots(date: DateValue, reservations: Reservation[]) {
	const dayOfTheWeek = getDayOfWeek(date, 'it-IT');
	const businessHours = WorkingHours.get(dayOfTheWeek);
	if (!businessHours) {
		// TODO
		return [];
	}

	const reservationsOfTheDay = reservations
		.filter((el) => el.date === date.toString())
		.map((el) => {
			return { startingTime: el.startingTime, duration: el.duration };
		});

	return businessHours.flatMap((el) =>
		getSlotsFromInterval(reservationsOfTheDay, el.start, el.end)
	);
}

export function getSlotsFromInterval(
	reservations: { startingTime: string; duration: Time }[],
	curr: Time,
	end: Time
): Slot[] {
	const slots: Slot[] = [];

	while (end.compare(curr) > 0) {
		// If we find a reserved slot
		const reservedSlot = reservations.find((el) => el.startingTime === curr.toString());

		if (!reservedSlot) {
			slots.push({
				time: curr.toString(),
				available: true
			});
		} else {
			if (reservedSlot.duration.compare(SlotDuration) <= 0) {
				// If the service duration is less that the slots we occupy on slot
				slots.push({ time: curr.toString(), available: false });
			} else {
				// We have to occupy more slots
				const slotCount = getSlotCountFromDuration(reservedSlot.duration, SlotDuration);
				for (let i = 0; i < slotCount; i++) {
					slots.push({
						time: curr.toString(),
						available: false
					});
					curr = curr.add({ hours: SlotDuration.hour, minutes: SlotDuration.minute });
				}
				continue;
			}
		}

		// Move to next slot
		curr = curr.add({ hours: SlotDuration.hour, minutes: SlotDuration.minute });
	}
	return sortSlots(slots);
}

function getSlotCountFromDuration(duration: Time, slot: Time): number {
	const totalMinutes = duration.hour * 60 + duration.minute;
	const slotMinutes = slot.hour * 60 + slot.minute;
	return Math.ceil(totalMinutes / slotMinutes);
}

function sortSlots(slots: Slot[]): Slot[] {
	return slots.sort((a, b) => {
		return parseTime(a.time).compare(parseTime(b.time));
	});
}
