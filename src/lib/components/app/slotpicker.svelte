<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { formatDate, formatTime } from '$lib/utils';
	import type { Slot } from '$lib/working-hours';
	import Badge from '../ui/badge/badge.svelte';
	import Label from '../ui/label/label.svelte';

	const reservationManager = ReservationManager.get();

	const { availableSlots }: { availableSlots: Slot[] } = $props();
</script>

<ScrollArea
	type="always"
	class="{availableSlots.length > 0 ? 'h-[300px]' : ''} rounded-md border p-4"
>
	<ToggleGroup.Root type="single" class="flex flex-col" bind:value={reservationManager.slot}>
		{#if availableSlots.length > 0}
			{#each availableSlots as s (s)}
				{@render SlotEntry(s)}
			{/each}
		{:else if reservationManager.date}
			<h2 class="text-lg font-bold">
				Nessun orario disponibile per {formatDate(reservationManager.date.toString())}
			</h2>
		{:else}
			Nessun orario disponibile
		{/if}
	</ToggleGroup.Root>
</ScrollArea>

{#snippet SlotEntry(s: Slot)}
	<ToggleGroup.Item
		class="flex w-full justify-between align-middle data-[state=on]:bg-primary data-[state=on]:text-background"
		value={s.time}
		disabled={!s.available}
	>
		<Label for={s.time}>{formatTime(s.time)}</Label>
		{#if !s.available}
			<Badge variant="destructive">Non disponibile</Badge>
		{/if}
	</ToggleGroup.Item>
{/snippet}
