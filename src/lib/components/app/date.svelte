<script>
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { fly } from 'svelte/transition';
	import DatePicker from './datepicker.svelte';
	import SlotPicker from './slotpicker.svelte';

	const reservationManager = ReservationManager.get();
</script>

<DatePicker bind:value={reservationManager.date} />

<!-- The grid is used to make the elements live in the same place thus avoiding glithes when animating -->
<div class="grid">
	{#if reservationManager.date}
		{#key reservationManager.date}
			<div
				class="col-span-full row-span-full"
				in:fly={{ x: 80, delay: 50 }}
				out:fly={{ x: -80 }}
			>
				<SlotPicker />
			</div>
		{/key}
	{/if}
</div>
