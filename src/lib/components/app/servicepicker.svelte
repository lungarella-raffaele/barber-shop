<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	let { services } = $props();

	const reservationManager = ReservationManager.get();
</script>

<RadioGroup.Root bind:value={reservationManager.selectedService}>
	{#each services as service (service.id)}
		<Label
			for={service.id}
			class=" flex w-full items-center justify-between space-x-2 rounded-lg border p-4"
		>
			<div class="flex items-center">
				<RadioGroup.Item value={service.id} id={service.id} class="mr-4" />
				{service.name}
			</div>
			<span class="text-muted-foreground">
				{service.price} &euro;
			</span>
		</Label>
	{/each}
</RadioGroup.Root>
