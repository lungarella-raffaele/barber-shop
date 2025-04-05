import { describe, it } from 'vitest';
import { getSlots, WorkingHours, type Reservation, type Slot } from './working-hours';
import { CalendarDate, Time } from '@internationalized/date';
import { expect } from '@playwright/test';
import { Day } from './enums/days';

describe('Working hours functions', () => {
	const monday: Slot[] = [
		{ time: '14:00:00', available: false },
		{ time: '14:30:00', available: true },
		{ time: '15:00:00', available: true },
		{ time: '15:30:00', available: false },
		{ time: '16:00:00', available: false },
		{ time: '16:30:00', available: true },
		{ time: '17:00:00', available: true },
		{ time: '17:30:00', available: false },
		{ time: '18:00:00', available: false },
		{ time: '18:30:00', available: true }
	];

	const normalDay: Slot[] = [
		{ time: '09:00:00', available: true },
		{ time: '09:30:00', available: true },
		{ time: '10:00:00', available: true },
		{ time: '10:30:00', available: true },
		{ time: '11:00:00', available: true },
		{ time: '11:30:00', available: true },
		{ time: '12:00:00', available: true },
		{ time: '12:30:00', available: true },
		{ time: '14:00:00', available: false },
		{ time: '14:30:00', available: true },
		{ time: '15:00:00', available: true },
		{ time: '15:30:00', available: true },
		{ time: '16:00:00', available: true },
		{ time: '16:30:00', available: true },
		{ time: '17:00:00', available: true },
		{ time: '17:30:00', available: true },
		{ time: '18:00:00', available: true }
	];
	// Monday
	it('should disable occupied slots', () => {
		const date = new CalendarDate(2022, 1, 3);
		const currentReservations: Reservation[] = [
			{
				date: '2022-01-03',
				startingTime: '14:00:00',
				duration: new Time(0, 30)
			},
			{
				date: '2022-01-03',
				startingTime: '15:30:00',
				duration: new Time(0, 30)
			},
			{
				date: '2022-01-03',
				startingTime: '16:00:00',
				duration: new Time(0, 30)
			},
			{
				date: '2022-01-03',
				startingTime: '17:30:00',
				duration: new Time(0, 45)
			}
		];

		const slots = getSlots(date, currentReservations);

		expect(slots?.every((el, index) => equalSlot(el, monday[index]))).toBe(true);
	});

	it('should not contain the end time as a slot', () => {
		const monday = new CalendarDate(2022, 1, 3);
		expect(
			getSlots(monday, [])?.find(
				(el) => el.time === WorkingHours.get(Day.MONDAY)?.[0].end.toString()
			)
		).toBe(undefined);
	});

	it('should create the correct number of slots', () => {
		const monday = new CalendarDate(2022, 1, 3);
		const otherDay = new CalendarDate(2022, 1, 4);
		const saturday = new CalendarDate(2022, 1, 8);

		expect(getSlots(monday, [])?.length).toEqual(10);
		expect(getSlots(otherDay, [])?.length).toEqual(17);
		expect(getSlots(saturday, [])?.length).toEqual(10);
	});

	// Tuesday Wednesday Thursday Friday
	it('should work correctly for normal days', () => {
		const date = new CalendarDate(2022, 2, 3);
		const currentReservations: Reservation[] = [
			{
				date: '2022-02-03',
				startingTime: '14:00:00',
				duration: new Time(0, 30)
			}
		];

		const slots = getSlots(date, currentReservations);
		expect(slots?.every((el, index) => equalSlot(el, normalDay[index]))).toBe(true);
	});

	it('should work for long duration services', () => {
		const date = new CalendarDate(2022, 2, 3);
		const currentReservations: Reservation[] = [
			{
				date: '2022-02-03',
				startingTime: '14:00:00',
				duration: new Time(2, 0)
			}
		];

		const correctSlots = [
			{ time: '09:00:00', available: true },
			{ time: '09:30:00', available: true },
			{ time: '10:00:00', available: true },
			{ time: '10:30:00', available: true },
			{ time: '11:00:00', available: true },
			{ time: '11:30:00', available: true },
			{ time: '12:00:00', available: true },
			{ time: '12:30:00', available: true },
			{ time: '14:00:00', available: false },
			{ time: '14:30:00', available: false },
			{ time: '15:00:00', available: false },
			{ time: '15:30:00', available: false },
			{ time: '16:00:00', available: true },
			{ time: '16:30:00', available: true },
			{ time: '17:00:00', available: true },
			{ time: '17:30:00', available: true },
			{ time: '18:00:00', available: true }
		];

		const slots = getSlots(date, currentReservations);
		expect(slots?.length).toEqual(correctSlots.length);
		expect(slots?.every((el, index) => equalSlot(el, correctSlots[index]))).toBe(true);
	});
});

function equalSlot(item1: Slot, item2: Slot): boolean {
	if (item1.time === item2.time) {
		if (item1.available === item2.available) {
			return true;
		}
	}
	return false;
}
