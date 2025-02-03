<script>
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import DatePicker from './datepicker.svelte';
	import SlotPicker from './slotpicker.svelte';

	const reservationManager = ReservationManager.get();
</script>

<DatePicker bind:value={reservationManager.date} />
{#if reservationManager.date}
	<SlotPicker />
{/if}
