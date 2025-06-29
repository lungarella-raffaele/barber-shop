import type { Slot } from '$lib/models/types';
import { parseTime } from '@internationalized/date';

// The following days have plain 15 minutes slots
export const monday: Slot[] = [
	{ start: parseTime('14:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('14:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('15:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('16:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:15:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('16:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:45:00'), available: true, invalid: false, past: false }
];

export const normalDay: Slot[] = [
	{ start: parseTime('09:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('09:15:00'), available: false, invalid: false, past: false },
	{ start: parseTime('09:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('09:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('11:45:00'), available: false, invalid: false, past: false },
	{ start: parseTime('12:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('15:45:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:15:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('16:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:15:00'), available: true, invalid: false, past: false }
];

export const saturday: Slot[] = [
	{ start: parseTime('10:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('11:45:00'), available: false, invalid: false, past: false },
	{ start: parseTime('12:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:45:00'), available: true, invalid: false, past: false },
	{ start: parseTime('13:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('13:15:00'), available: false, invalid: false, past: false },
	{ start: parseTime('13:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('13:45:00'), available: false, invalid: false, past: false },
	{ start: parseTime('14:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:15:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:45:00'), available: true, invalid: false, past: false }
];
