import { describe, it } from 'vitest';
import { workingHours } from './working-hours';
import { CalendarDate, Time } from '@internationalized/date';
import { expect } from '@playwright/test';
import { Day } from './enums/days';
import { getSlots } from './get-slots';
import type { Slot, Reservation } from './types';

describe('Working hours functions', () => {
	const monday: Slot[] = [
		{ startingTime: '14:00:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '14:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '15:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '15:30:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '16:00:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '16:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '17:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '17:30:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '18:00:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '18:30:00', available: true, hasEnoughFollowingSlots: true }
	];

	const normalDay: Slot[] = [
		{ startingTime: '09:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '09:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '10:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '10:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '11:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '11:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '12:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '12:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '14:00:00', available: false, hasEnoughFollowingSlots: undefined },
		{ startingTime: '14:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '15:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '15:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '16:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '16:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '17:00:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '17:30:00', available: true, hasEnoughFollowingSlots: true },
		{ startingTime: '18:00:00', available: true, hasEnoughFollowingSlots: true }
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

		const slots = getSlots(date, currentReservations, 30);
		expect(slots?.every((el, index) => equalSlot(el, monday[index], index))).toBe(true);
	});

	it('should not contain the end startingTime as a slot', () => {
		const monday = new CalendarDate(2022, 1, 3);
		expect(
			getSlots(monday, [], 30)?.find(
				(el) => el.startingTime === workingHours.get(Day.MONDAY)?.[0].end.toString()
			)
		).toBe(undefined);
	});

	it('should create the correct number of slots', () => {
		const monday = new CalendarDate(2022, 1, 3);
		const otherDay = new CalendarDate(2022, 1, 4);
		const saturday = new CalendarDate(2022, 1, 8);

		expect(getSlots(monday, [], 30)?.length).toEqual(10);
		expect(getSlots(otherDay, [], 30)?.length).toEqual(17);
		expect(getSlots(saturday, [], 30)?.length).toEqual(10);
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

		const slots = getSlots(date, currentReservations, 30);
		expect(slots?.every((el, index) => equalSlot(el, normalDay[index], index))).toBe(true);
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

		const correctSlots: Slot[] = [
			{ startingTime: '09:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '09:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '12:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '12:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '14:00:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '14:30:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '15:00:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '15:30:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '16:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '16:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '18:00:00', available: true, hasEnoughFollowingSlots: true }
		];

		const slots = getSlots(date, currentReservations, 30);
		expect(slots?.length).toEqual(correctSlots.length);
		expect(slots?.every((el, index) => equalSlot(el, correctSlots[index], index))).toBe(true);
	});

	it('should handle long duration services correctly', () => {
		const date = new CalendarDate(2022, 2, 3);
		const currentReservations: Reservation[] = [
			{
				date: '2022-02-03',
				startingTime: '14:00:00',
				duration: new Time(0, 30)
			},
			{ date: '2022-02-03', startingTime: '15:00:00', duration: new Time(0, 30) }
		];

		const correctSlots = [
			{ startingTime: '09:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '09:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '12:00:00', available: true, hasEnoughFollowingSlots: false },
			{ startingTime: '12:30:00', available: true, hasEnoughFollowingSlots: false },
			{ startingTime: '14:00:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '14:30:00', available: true, hasEnoughFollowingSlots: false },
			{ startingTime: '15:00:00', available: false, hasEnoughFollowingSlots: undefined },
			{ startingTime: '15:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '16:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '16:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:30:00', available: true, hasEnoughFollowingSlots: false },
			{ startingTime: '18:00:00', available: true, hasEnoughFollowingSlots: false }
		];

		const slots = getSlots(date, currentReservations, 80);

		expect(slots?.length).toEqual(correctSlots.length);
		expect(slots?.every((el, index) => equalSlot(el, correctSlots[index], index))).toBe(true);
	});

	it('should handle edge cases correctly', () => {
		const date = new CalendarDate(2022, 2, 3);

		const correctSlots = [
			{ startingTime: '09:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '09:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '10:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '11:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '12:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '12:30:00', available: true, hasEnoughFollowingSlots: false },
			{ startingTime: '14:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '14:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '15:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '15:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '16:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '16:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:00:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '17:30:00', available: true, hasEnoughFollowingSlots: true },
			{ startingTime: '18:00:00', available: true, hasEnoughFollowingSlots: false }
		];

		const slots = getSlots(date, [], 45);

		console.log(slots);

		expect(slots?.length).toEqual(correctSlots.length);
		expect(slots?.every((el, index) => equalSlot(el, correctSlots[index], index))).toBe(true);
	});
});

function equalSlot(item1: Slot, item2: Slot, index: number): boolean {
	if (item1.startingTime === item2.startingTime) {
		if (item1.available === item2.available) {
			if (item1.hasEnoughFollowingSlots === item2.hasEnoughFollowingSlots) {
				return true;
			}
		}
	}
	console.error(`The element at position ${index} is not equal!`);
	return false;
}
