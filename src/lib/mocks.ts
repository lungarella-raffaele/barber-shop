import { parseTime } from '@internationalized/date';
import type { Slot } from './types';

// The following days have plain 30 minutes slots
export const monday: Slot[] = [
	{ start: parseTime('14:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:30:00'), available: true, invalid: false, past: false }
];

export const normalDay: Slot[] = [
	{ start: parseTime('09:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('09:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('12:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('15:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('16:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('17:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('18:00:00'), available: true, invalid: false, past: false }
];

export const saturday: Slot[] = [
	{ start: parseTime('10:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('10:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('11:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('12:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('12:30:00'), available: true, invalid: false, past: false },
	{ start: parseTime('13:00:00'), available: false, invalid: false, past: false },
	{ start: parseTime('13:30:00'), available: false, invalid: false, past: false },
	{ start: parseTime('14:00:00'), available: true, invalid: false, past: false },
	{ start: parseTime('14:30:00'), available: true, invalid: false, past: false }
];
