import { getDayOfWeek, parseTime, Time, type DateValue } from '@internationalized/date';
import { minutesToTime } from './utils';
import type { Reservation, Slot } from './types';
import { workingHours } from './working-hours';

export const SlotDuration = new Time(0, 30);
export function getSlots(
	date: DateValue,
	reservations: Reservation[],
	serviceDuration: number | undefined
): Slot[] {
	const dayOfTheWeek = getDayOfWeek(date, 'it-IT');
	const businessIntervals = workingHours.get(dayOfTheWeek);
	if (!businessIntervals) {
		// TODO
		return [];
	}

	const reservationsOfTheDay = reservations
		.filter((el) => el.date === date.toString())
		.map((el) => {
			return { startingTime: el.startingTime, duration: el.duration };
		});

	// Array of slots for every interval
	const arrayOfSlots = businessIntervals.map((interval) =>
		getSlotsFromInterval(reservationsOfTheDay, interval.start, interval.end)
	);

	const slots = arrayOfSlots.flatMap((array) => {
		return array.map((slot, index) => {
			if (!serviceDuration) {
				return slot;
			}
			return {
				...slot,
				hasEnoughFollowingSlots: hasEnoughFollowingSlots(
					slot,
					index,
					structuredClone(array),
					serviceDuration
				)
			};
		});
	});

	return slots;

	// return slots.map((el) => {
	// 	return { ...el, strict: false };
	// });
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
				startingTime: curr.toString(),
				available: true,
				hasEnoughFollowingSlots: true
			});
		} else {
			if (reservedSlot.duration.compare(SlotDuration) <= 0) {
				// If the service duration is less that the slots we occupy on slot
				slots.push({
					startingTime: curr.toString(),
					available: false,
					hasEnoughFollowingSlots: true
				});
			} else {
				// We have to occupy more slots
				const slotCount = getSlotCountFromDuration(reservedSlot.duration, SlotDuration);
				for (let i = 0; i < slotCount; i++) {
					slots.push({
						startingTime: curr.toString(),
						available: false,
						hasEnoughFollowingSlots: true
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

function getSlotCountFromDuration(duration: Time, slotDuration: Time): number {
	const totalMinutes = duration.hour * 60 + duration.minute;
	const slotMinutes = slotDuration.hour * 60 + slotDuration.minute;
	return Math.ceil(totalMinutes / slotMinutes);
}

function sortSlots(slots: Slot[]): Slot[] {
	return slots.sort((a, b) => {
		return parseTime(a.startingTime).compare(parseTime(b.startingTime));
	});
}

/**
 * This function helps check if enough consecutive slots are available when a service requires multiple time slots.
 */
function hasEnoughFollowingSlots(
	slot: Slot,
	slotPosition: number,
	slots: Slot[],
	_duration: number
): boolean | undefined {
	if (!slot.available) {
		return undefined;
	}
	// If the current slot is available
	const duration = minutesToTime(_duration);

	const numberOfSlotOccupied = getSlotCountFromDuration(duration, SlotDuration);
	if (numberOfSlotOccupied === 1) {
		return true;
	}

	const slotsToVerify = slots.splice(slotPosition, numberOfSlotOccupied);
	if (slotsToVerify.length !== numberOfSlotOccupied) {
		return false;
	}
	return slotsToVerify.every((el) => el.available);
}
