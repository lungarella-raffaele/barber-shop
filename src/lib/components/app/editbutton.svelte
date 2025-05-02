<script lang="ts">
	import { Pencil, X } from '$lib/components/icons';
	import { Toggle } from '$lib/components/ui/toggle/index.js';

	let { pressed = $bindable(), onclick }: { pressed: boolean; onclick?: () => void } = $props();
</script>

<Toggle
	{onclick}
	bind:pressed
	aria-label="toggle edit"
	class="bold border data-[state=on]:bg-primary data-[state=on]:text-background"
>
	{#if pressed}
		<X />
		Annulla
	{:else}
		<Pencil />
		Modifica
	{/if}
</Toggle>
