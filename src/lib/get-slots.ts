import {
	getDayOfWeek,
	getLocalTimeZone,
	now,
	Time,
	today,
	type DateValue
} from '@internationalized/date';
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
		getSlotsFromInterval(reservationsOfTheDay, date, interval.start, interval.end)
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

	return sortSlots(slots);
}

export function getSlotsFromInterval(
	reservations: { startingTime: string; duration: Time }[],
	date: DateValue,
	curr: Time,
	end: Time
): Slot[] {
	const slots: Slot[] = [];

	while (end.compare(curr) > 0) {
		// If we find a reserved slot
		const reservedSlot = reservations.find((el) => el.startingTime === curr.toString());

		const time = now(getLocalTimeZone());
		const timeInTime = new Time(time.hour, time.minute);

		if (timeInTime.compare(curr) < 0 && date.compare(today(getLocalTimeZone())) === 0) {
			slots.push({
				startingTime: curr,
				available: false,
				hasEnoughFollowingSlots: undefined
			});
		} else if (!reservedSlot) {
			slots.push({
				startingTime: curr,
				available: true,
				hasEnoughFollowingSlots: true
			});
		} else {
			if (reservedSlot.duration.compare(SlotDuration) <= 0) {
				// If the service duration is less that the slots we occupy on slot
				slots.push({
					startingTime: curr,
					available: false,
					hasEnoughFollowingSlots: true
				});
			} else {
				// We have to occupy more slots
				const slotCount = getSlotCountFromDuration(reservedSlot.duration, SlotDuration);
				for (let i = 0; i < slotCount; i++) {
					slots.push({
						startingTime: curr,
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
	return slots;
}

function getSlotCountFromDuration(duration: Time, slotDuration: Time): number {
	const totalMinutes = duration.hour * 60 + duration.minute;
	const slotMinutes = slotDuration.hour * 60 + slotDuration.minute;
	return Math.ceil(totalMinutes / slotMinutes);
}

function sortSlots(slots: Slot[]): Slot[] {
	return slots.sort((a, b) => {
		return a.startingTime.compare(b.startingTime);
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
