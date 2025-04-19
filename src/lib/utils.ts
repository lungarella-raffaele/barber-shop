import { DateFormatter, getLocalTimeZone, parseDate, Time } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTime(time: Time | string) {
	return time.toString().substring(0, time.toString().length - 3);
}

export const formatDate = (
	date: string,
	dateStyle: 'long' | 'full' | 'medium' | 'short' | undefined = 'long'
) => {
	const df = new DateFormatter('it-IT', {
		dateStyle
	});

	const dateValue = parseDate(date);
	return df.format(dateValue.toDate(getLocalTimeZone()));
};

export const formatDateWithoutYear = (date: string) => {
	const df = new DateFormatter('it-IT', {
		dateStyle: 'long'
	});

	const dateValue = parseDate(date);
	const d = df.format(dateValue.toDate(getLocalTimeZone()));

	return d.substring(0, d.lastIndexOf(' '));
};

export const formatDateWithoutMonth = (date: string) => {
	const df = new DateFormatter('it-IT', {
		dateStyle: 'long'
	});

	const dateValue = parseDate(date);
	const d = df.format(dateValue.toDate(getLocalTimeZone()));

	return d.substring(0, d.indexOf(' '));
};

export const formatDateRange = (date1: string, date2: string) => {
	// Convert to calendar date for easy manipulating
	const dateValue1 = parseDate(date1);
	const dateValue2 = parseDate(date2);

	if (dateValue1.year === dateValue2.year) {
		if (dateValue1.month === dateValue2.month) {
			if (dateValue1.day === dateValue2.day) {
				// Same day
				return formatDate(dateValue1.toString());
			}
			// Different day
			return (
				formatDateWithoutMonth(dateValue1.toString()) +
				' - ' +
				formatDate(dateValue2.toString())
			);
			// Different month
		}
		return (
			formatDateWithoutYear(dateValue1.toString()) + ' - ' + formatDate(dateValue2.toString())
		);
	}

	// Different year
	return (
		formatDate(dateValue1.toString(), 'medium') +
		' - ' +
		formatDate(dateValue2.toString(), 'medium')
	);
};

export const formatCurrency = (amount: string) => {
	const formatter = new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR'
	});

	return formatter.format(Number.parseFloat(amount));
};

export function toDecimalHours(hours: number, minutes: number) {
	return hours + minutes / 60;
}

export function extractHoursAndMinutes(timeString: string) {
	const [hours, minutes] = timeString.split(':').map(Number);
	return { hours, minutes };
}

export function expired(timestamp: number): boolean {
	return timestamp < Date.now();
}

export function minutesToTime(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return new Time(hours, minutes);
}

export function isEqualTime(t1: Time, t2: Time) {
	return t1.compare(t2) === 0;
}

export function getString(data: FormData, key: string): string {
	return data.get(key)?.toString() ?? '';
}

export function getNumber(data: FormData, key: string): number {
	const val = Number(data.get(key));
	return isNaN(val) ? 0 : val;
}

export function getBoolean(data: FormData, key: string): boolean {
	return data.get(key) === 'on'; // or 'true' depending on form
}
