<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { getSlots } from '$lib/working-hours';
	import Label from '../ui/label/label.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { displayTime } from '$lib/utils';

	const reservationManager = ReservationManager.get();
	const slots = $derived(getSlots(reservationManager.date));
</script>

<ScrollArea type="always" class="h-[300px] rounded-md border p-4">
	<ToggleGroup.Root type="single" class="flex flex-col" bind:value={reservationManager.slot}>
		{#each slots as s}
			{#if s.available}
				{@render SlotEntry(s)}
			{/if}
		{/each}
	</ToggleGroup.Root>
</ScrollArea>

{#snippet SlotEntry({ time, available }: { time: string; available: boolean })}
	<ToggleGroup.Item
		class="flex w-full justify-between align-middle data-[state=on]:bg-primary data-[state=on]:text-background"
		value={time}
		disabled={!available}
	>
		<Label for={time}>{displayTime(time)}</Label>
	</ToggleGroup.Item>
{/snippet}
