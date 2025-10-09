import type { BusinessHours } from '@types';
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

// {
//   "0": [{"start": "14:00", "end": "19:00"}],
//   "1": [{"start": "09:00", "end": "13:00"}, {"start": "14:00", "end": "18:30"}],
//   "2": [{"start": "09:00", "end": "13:00"}, {"start": "14:00", "end": "18:30"}],
//   "3": [{"start": "09:00", "end": "13:00"}, {"start": "14:00", "end": "18:30"}],
//   "4": [{"start": "09:00", "end": "13:00"}, {"start": "14:00", "end": "18:30"}],
//   "5": [{"start": "10:00", "end": "15:00"}]
// }

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
