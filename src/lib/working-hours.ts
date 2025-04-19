import type { BusinessHours } from '$lib/models/types';
import { Time } from '@internationalized/date';
import { Day } from './enums/days';

/**
 * Monday 2 PM – 7 PM
 * Tuesday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Wednesday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Thursday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Friday 9 AM – 1 PM / 2 PM – 6:30 PM
 * Saturday 10 AM – 3 PM
 */
export const workingHours = new Map<Day, BusinessHours[]>([
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
