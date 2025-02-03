<script>
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import DatePicker from './datepicker.svelte';
	import Hourpicker from './hourpicker.svelte';

	const reservationManager = ReservationManager.get();
</script>

<DatePicker bind:value={reservationManager.date} />
{#if reservationManager.date}
	<Hourpicker bind:value={reservationManager.hour} />
{/if}
