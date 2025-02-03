import type { Time } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayTime(time: Time | string) {
	return time.toString().substring(0, time.toString().length - 3);
}
