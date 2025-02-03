<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { type DateValue } from '@internationalized/date';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	let { value = $bindable() }: { value: DateValue | undefined } = $props();
	const reservationManager = ReservationManager.get();
</script>

<Calendar
	onValueChange={() => (reservationManager.slot = '')}
	type="single"
	bind:value
	class="rounded-md border"
/>
