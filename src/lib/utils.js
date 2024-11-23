/**
 * Formats a JavaScript Date object to Italian-style format with custom capitalization and comma placement.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date string in Italian with capitalization and comma after the day.
 */
export function formatToITLocale(date) {
	/** @type {Intl.DateTimeFormatOptions} */
	const options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: '2-digit'
	};
	const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);

	// Split the parts based on Italian format (default: "dom 3 novembre 2024")
	const [weekday, day, month, year] = formattedDate.split(' ');

	// Capitalize the first letter of the weekday, add a comma after the day
	const capitalizedWeekday = capitalize(weekday);
	const capitalizedMonth = capitalize(month);
	return `${capitalizedWeekday}, ${day} ${capitalizedMonth} ${year}`;
}

/** @param {string} str */
export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const DayOfTheWeek = {
	MONDAY: 0,
	TUESDAY: 1,
	WEDNESDAY: 2,
	THURSDAY: 3,
	FRIDAY: 4,
	SATURDAY: 5,
	SUNDAY: 6
};
