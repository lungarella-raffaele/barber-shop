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

{#if date}
	<!-- The grid is used to make the elements live in the same place thus avoiding glithes when animating -->
	<h2 class="font-semibold leading-none">Orario</h2>
	<p class="text-sm text-muted-foreground">Seleziona un orario</p>

	{#if availableSlots.length > 0}
		<div class="grid overflow-hidden">
			{#key date}
				<div
					class="col-span-full row-span-full"
					in:fly={{ x: 150, delay: 50 }}
					out:fly={{ x: -150 }}
				>
					<ScrollArea
						type="always"
						class="{availableSlots.length > 0 ? 'h-[300px]' : ''} rounded-md border p-4"
					>
						<ToggleGroup.Root type="single" class="flex flex-col" bind:value>
							{#each availableSlots as s (s)}
								{@render SlotEntry(s)}
							{/each}
						</ToggleGroup.Root>
					</ScrollArea>
				</div>
			{/key}
		</div>
	{:else if date}
		<h2 class="text-lg font-bold">
			Nessun orario disponibile per {formatDate(date.toString())}
		</h2>
	{:else}
		Nessun orario disponibile
	{/if}
{/if}

{#snippet SlotEntry(s: Slot)}
	<ToggleGroup.Item
		class="flex w-full justify-between border bg-background align-middle transition-all duration-200 ease-in-out data-[disabled]:border-destructive data-[state=on]:border-primary data-[state=on]:bg-primary-foreground"
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
