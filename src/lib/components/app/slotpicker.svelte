<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import Label from '../ui/label/label.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { displayTime } from '$lib/utils';
	import Badge from '../ui/badge/badge.svelte';

	const reservationManager = ReservationManager.get();
</script>

<ScrollArea type="always" class="h-[300px] rounded-md border p-4">
	<ToggleGroup.Root type="single" class="flex flex-col" bind:value={reservationManager.slot}>
		{#each reservationManager.availableSlots as s}
			{@render SlotEntry(s)}
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
		{#if !available}
			<Badge variant="destructive">Non disponibile</Badge>
		{/if}
	</ToggleGroup.Item>
{/snippet}
