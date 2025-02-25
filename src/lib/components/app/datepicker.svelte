<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	let { value = $bindable() }: { value: DateValue | undefined } = $props();
	const reservationManager = ReservationManager.get();
	function isDateDisabled(date: DateValue) {
		// Only future reservations
		return today(getLocalTimeZone()).compare(date) > 0;
	}

	function isDateUnavailable(date: DateValue): boolean {
		for (const closure of reservationManager.closures) {
			const start = parseDate(closure.start);
			const end = parseDate(closure.end);
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
	onValueChange={() => (reservationManager.slot = '')}
	type="single"
	bind:value
	class="rounded-md border"
/>
