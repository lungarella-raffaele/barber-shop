<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import {
		getDayOfWeek,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue
	} from '@internationalized/date';

	let {
		value = $bindable(),
		closures
	}: { value: string; closures: { start: string; end: string; id: string }[] } = $props();
	const rm = ReservationManager.get();
	function isDateDisabled(date: DateValue) {
		// Only future reservations and sundays are disabled
		return today(getLocalTimeZone()).compare(date) > 0 || getDayOfWeek(date, 'it-IT') === 6;
	}

	function isDateUnavailable(date: DateValue): boolean {
		for (const c of closures) {
			const start = parseDate(c.start);
			const end = parseDate(c.end);
			if (date.compare(end) > 0) {
				continue;
			}
			return date.compare(start) >= 0 && date.compare(end) <= 0;
		}

		return false;
	}
</script>

<Calendar
	{isDateDisabled}
	{isDateUnavailable}
	onValueChange={() => (rm.data.hour = '')}
	bind:value={
		() => {
			try {
				return parseDate(rm.data.date);
			} catch {
				return undefined;
			}
		},
		(v) => (rm.data.date = v?.toString() ?? '')
	}
	type="single"
	class="mb-6 rounded-md border"
/>
