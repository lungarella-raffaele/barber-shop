<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import type { Slot } from '$lib/types';
	import { formatDate, formatTime } from '$lib/utils';
	import { CalendarX, ClockAlert } from '../icons';
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
		class="-destructive flex w-full justify-between border-2 align-middle data-[disabled]:border-destructive data-[state=on]:bg-primary data-[state=on]:text-background"
		value={s.start.toString()}
		disabled={!s.available || s.invalid || s.past}
	>
		<Label for={s.start.toString()}>{formatTime(s.start)}</Label>
		{#if !s.available}
			<div class="flex items-center">Riservato<CalendarX class="ml-1" /></div>
		{:else if s.past}
			<div class="flex items-center">Scaduto<ClockAlert class="ml-1" /></div>
		{:else if s.invalid}
			<div class="flex items-center">Tempo insufficiente<ClockAlert class="ml-1" /></div>
		{/if}
	</ToggleGroup.Item>
{/snippet}
