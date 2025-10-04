<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import type { DBKind } from '@types';

	let {
		kinds,
		value = $bindable()
	}: {
		kinds: DBKind[];
		value: string;
	} = $props();
</script>

<RadioGroup.Root bind:value>
	{#if kinds.length === 0}
		<span class="font-bold">Nessun servizio disponibile</span>
	{:else}
		{#each kinds as kind (kind.id)}
			<Label
				for={kind.id}
				class="mb-2 flex w-full items-center justify-between space-x-2 rounded-lg border p-4 transition-all duration-200 ease-in-out
			{kind.id === value
					? 'border-primary bg-primary-foreground shadow-lg'
					: 'hover:border-primary-foreground'}"
			>
				<div class="flex items-center">
					<RadioGroup.Item value={kind.id} id={kind.id} class="mr-4 " />
					<div class="flex-1 text-left">
						<div class="text-lg font-semibold">{kind.name}</div>
						<div class="text-sm text-muted-foreground">{kind.duration} minuti</div>
					</div>
				</div>
			</Label>
		{/each}
	{/if}
</RadioGroup.Root>
