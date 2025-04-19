<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	const {
		services
	}: {
		services: {
			id: string;
			name: string;
			duration: number;
			price: number;
			description: string;
			active: boolean | null;
		}[];
	} = $props();

	const reservationManager = ReservationManager.get();
</script>

<RadioGroup.Root bind:value={reservationManager.selectedService}>
	{#each services as service (service.id)}
		<Label
			for={service.id}
			class="flex w-full items-center justify-between space-x-2 rounded-lg border p-4 hover:border-primary"
		>
			<div class="flex items-center">
				<RadioGroup.Item value={service.id} id={service.id} class="mr-4" />
				<div class="flex-1 text-left">
					<div class="text-lg font-semibold">{service.name}</div>
					<div class="text-sm text-gray-400">{service.duration} minuti</div>
				</div>
			</div>
			<span class="text-muted-foreground">
				{service.price} &euro;
			</span>
		</Label>
	{/each}
</RadioGroup.Root>
