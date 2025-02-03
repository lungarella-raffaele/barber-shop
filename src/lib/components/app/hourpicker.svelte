<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { getSlots } from '$lib/working-hours';
	import Label from '../ui/label/label.svelte';
	import type { Time } from '@internationalized/date';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	const slots = getSlots();

	let { value = $bindable() } = $props();
</script>

<ScrollArea type="always" class="h-[300px] rounded-md border p-4">
	<ToggleGroup.Root type="single" class="flex flex-col" bind:value>
		{#each slots as s}
			{#if s.available}
				{@render HourEntry(s)}
			{/if}
		{/each}
	</ToggleGroup.Root>
</ScrollArea>

{#snippet HourEntry({ id, time, available }: { id: string; time: Time; available: boolean })}
	<ToggleGroup.Item
		class="flex w-full justify-between align-middle data-[state=on]:bg-primary data-[state=on]:text-background"
		value={id}
		disabled={!available}
	>
		<Label for={id}>{time.toString().substring(0, time.toString().length - 3)}</Label>
	</ToggleGroup.Item>
{/snippet}
