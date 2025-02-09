<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	let { value = $bindable() }: { value: DateValue | undefined } = $props();
	const reservationManager = ReservationManager.get();
	function isDateDisabled(date: DateValue) {
		// Only future reservations
		return today(getLocalTimeZone()).compare(date) > 0;
	}
</script>

<Calendar
	{isDateDisabled}
	onValueChange={() => (reservationManager.slot = '')}
	type="single"
	bind:value
	class="rounded-md border"
/>
