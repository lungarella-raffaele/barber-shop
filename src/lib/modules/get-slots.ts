import type { ReservedSlot, Slot } from '@types';
import {
	getDayOfWeek,
	getLocalTimeZone,
	isToday,
	now,
	Time,
	type DateValue
} from '@internationalized/date';
import { workingHours } from '$lib/working-hours';

export const SlotDuration = new Time(0, 15);

export const getSlots = (date: DateValue, reservations: ReservedSlot[], kind?: Time) => {
	let slots = generateSlots(date);

	// reserved slots
	slots = reserved(slots, reservations);

	// slots in the past
	if (isToday(date, getLocalTimeZone())) {
		const n = now(getLocalTimeZone());
		slots = slots.map((slot) => ({ ...slot, past: slot.start.compare(n) < 0 }));
	}

	// slots with not enough time
	if (kind) {
		slots = invalid(slots, kind);
	}

	return sortSlots(slots);
};

function invalid(slots: Slot[], duration: Time) {
	const nSlots = slotCount(duration, SlotDuration);
	if (nSlots === 1) {
		return slots;
	}

	return slots.map((s, index) => {
		if (!s.available) {
			return s;
		}
		const nextSlots = structuredClone(slots).splice(index, nSlots);

		if (nextSlots.length !== nSlots) {
			return { ...s, invalid: true };
		}

		if (!slotsWithoutGaps(nextSlots)) {
			return { ...s, invalid: true };
		}

		if (nextSlots.some((el) => !el.available)) {
			return { ...s, invalid: true };
		} else {
			return s;
		}
	});
}

function slotsWithoutGaps(slots: Slot[]) {
	for (const [i, current] of slots.entries()) {
		const next = slots[i + 1];
		if (!next) {
			continue;
		}
		const diffMinutes =
			(next.start.hour - current.start.hour) * 60 +
			(next.start.minute - current.start.minute);

		if (diffMinutes > SlotDuration.hour * 60 + SlotDuration.minute) {
			return false;
		}
	}
	return true;
}

function isAvailable(slot: Slot, reservations: ReservedSlot[]): boolean {
	for (const r of reservations) {
		const startInterval = r.start;
		const endInterval = r.start.add({ hours: r.duration.hour, minutes: r.duration.minute });

		if (slot.start.compare(startInterval) >= 0 && slot.start.compare(endInterval) < 0) {
			return false;
		}
	}

	return true;
}

function reserved(slots: Slot[], reservations: ReservedSlot[]): Slot[] {
	return slots.map((s) => ({ ...s, available: isAvailable(s, reservations) }));
}

function slotCount(duration: Time, slotDuration: Time): number {
	const totalMinutes = duration.hour * 60 + duration.minute;
	const slotMinutes = slotDuration.hour * 60 + slotDuration.minute;
	return Math.ceil(totalMinutes / slotMinutes);
}

function generateSlots(date: DateValue) {
	const dayOfTheWeek = getDayOfWeek(date, 'it-IT');
	const businessIntervals = workingHours.get(dayOfTheWeek);
	if (!businessIntervals) {
		return [];
	}
	return businessIntervals.flatMap((interval) =>
		generateSlotsFromInterval(interval.start, interval.end)
	);
}

export function generateSlotsFromInterval(start: Time, end: Time): Slot[] {
	const slots: Slot[] = [];
	let current = start;

	while (current.compare(end) < 0) {
		slots.push({ start: current, available: true, invalid: false, past: false });
		current = current.add({ hours: SlotDuration.hour, minutes: SlotDuration.minute });
	}

	return slots;
}

function sortSlots(slots: Slot[]): Slot[] {
	return slots.sort((a, b) => {
		return a.start.compare(b.start);
	});
}
