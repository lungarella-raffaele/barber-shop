<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import type { Slot } from '@types';
	import { formatDate, formatTime } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { CalendarX, ClockAlert } from '$lib/components/icons';
	import Label from '$lib/components/ui/label/label.svelte';

	let {
		availableSlots,
		date,
		value = $bindable()
	}: { availableSlots: Slot[]; date: string; value: string } = $props();
</script>

<h2 class="font-semibold leading-none">Orario</h2>
<p class="text-sm text-muted-foreground">Seleziona un orario</p>

<div class="grid overflow-hidden">
	<ScrollArea
		type="always"
		class="{availableSlots.length > 0 ? 'h-[300px]' : ''} rounded-md border p-4"
	>
		{#if date && availableSlots.length > 0}
			<ToggleGroup.Root type="single" bind:value class="flex flex-col">
				{#each availableSlots as s, idx (s)}
					<div
						class="w-full"
						in:fly={{ y: -20, duration: 300, delay: 10 * idx }}
						out:fly={{ y: 20, duration: 200 }}
					>
						{@render SlotEntry(s)}
					</div>
				{/each}
			</ToggleGroup.Root>
		{:else if date}
			Nessun orario disponibile per il {formatDate(date.toString())}
			<br />
			<span class="text-muted-foreground">Scegli un altro giorno</span>
		{:else}
			Nessuna data selezionata
		{/if}
	</ScrollArea>
</div>

{#snippet SlotEntry(s: Slot)}
	<ToggleGroup.Item
		class="flex w-full justify-between border align-middle transition-all duration-200 ease-in-out data-[disabled]:border-destructive data-[state=on]:border-primary data-[state=on]:bg-primary-foreground"
		value={s.start.toString()}
		disabled={!s.available || s.invalid || s.past}
	>
		<div class="flex w-full items-center justify-between">
			<Label class="mb-0" for={s.start.toString()}>{formatTime(s.start)}</Label>
			{#if !s.available}
				<div class="flex items-center">
					Riservato<CalendarX class="ml-1" />
				</div>
			{:else if s.past}
				<div class="flex items-center">
					Scaduto<ClockAlert class="ml-1" />
				</div>
			{:else if s.invalid}
				<div class="flex items-center">
					Tempo insufficiente<ClockAlert class="ml-1" />
				</div>
			{/if}
		</div>
	</ToggleGroup.Item>
{/snippet}
