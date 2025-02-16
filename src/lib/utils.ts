import { DateFormatter, getLocalTimeZone, parseDate, type Time } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTime(time: Time | string) {
	return time.toString().substring(0, time.toString().length - 3);
}

export const formatDate = (date: string) => {
	const df = new DateFormatter('it-IT', {
		dateStyle: 'long'
	});

	const dateValue = parseDate(date);
	return df.format(dateValue.toDate(getLocalTimeZone()));
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
