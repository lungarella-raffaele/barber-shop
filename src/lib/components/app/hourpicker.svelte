<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import Label from '../ui/label/label.svelte';

	const hourEntries = [
		{
			hour: '10:00',
			available: false
		},
		{
			hour: '12:00',
			available: true
		},
		{
			hour: '16:00',
			available: true
		},
		{
			hour: '18:00',
			available: false
		}
	];

	let { value = $bindable() } = $props();
</script>

<ToggleGroup.Root type="single" class="flex flex-col" bind:value>
	{#each hourEntries as entry}
		{@render HourEntry(entry)}
	{/each}
</ToggleGroup.Root>

{#snippet HourEntry({ hour, available }: { hour: string; available: boolean })}
	<ToggleGroup.Item
		class="flex w-full justify-between align-middle"
		value={hour}
		disabled={!available}
	>
		<div>
			<Checkbox id={hour} checked={value === hour} class="mr-2" />
			<Label for={hour}>{hour}</Label>
		</div>
		{#if available}
			<Badge>Disponibile</Badge>
		{:else}
			<Badge variant="destructive">Non Disponibile</Badge>
		{/if}
	</ToggleGroup.Item>
{/snippet}
