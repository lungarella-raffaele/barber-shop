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
	import type { DBShutdown } from '@types';
	import { checkShutdown } from './check-shutdown';

	let { value = $bindable(), shutdown }: { value: string; shutdown: DBShutdown[] } = $props();
	const rm = ReservationManager.get();
	function isDateDisabled(date: DateValue) {
		// Only future reservations and sundays are disabled
		return today(getLocalTimeZone()).compare(date) > 0 || getDayOfWeek(date, 'it-IT') === 6;
	}

	function isDateUnavailable(date: DateValue): boolean {
		return checkShutdown(date, shutdown, rm.data.staff);
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
