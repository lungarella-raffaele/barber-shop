<script>
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import Button from '../ui/button/button.svelte';
	import DatePicker from './datepicker.svelte';
	import Hourpicker from './hourpicker.svelte';

	const reservationManager = ReservationManager.get();

	const df = new DateFormatter('it-IT', {
		dateStyle: 'long'
	});
</script>

{#if reservationManager.date}
	<div class="flex items-center justify-between">
		<span class="text-sm font-semibold text-muted-foreground">
			{reservationManager.date ? df.format(reservationManager.date.toDate(getLocalTimeZone())) : ''}
			{#if reservationManager.hour}
				- {reservationManager.hour}
			{/if}
		</span>
		<Button variant="ghost" onclick={() => (reservationManager.date = undefined)}
			>Cambia data</Button
		>
	</div>
	<Hourpicker bind:value={reservationManager.hour} />
{:else}
	<DatePicker bind:value={reservationManager.date} />
{/if}
