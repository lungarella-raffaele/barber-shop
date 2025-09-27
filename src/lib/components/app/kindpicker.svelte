<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	const {
		kinds
	}: {
		kinds: {
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

<RadioGroup.Root bind:value={reservationManager.selectedKind}>
	{#each kinds as kind (kind.id)}
		<Label
			for={kind.id}
			class="flex w-full items-center justify-between space-x-2 rounded-lg border p-4 hover:border-primary"
		>
			<div class="flex items-center">
				<RadioGroup.Item value={kind.id} id={kind.id} class="mr-4" />
				<div class="flex-1 text-left">
					<div class="text-lg font-semibold">{kind.name}</div>
					<div class="text-sm text-gray-400">{kind.duration} minuti</div>
				</div>
			</div>
		</Label>
	{/each}
</RadioGroup.Root>
