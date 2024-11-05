<script>
	import { createToggleGroup, melt } from '@melt-ui/svelte';

	const {
		elements: { root, item }
	} = createToggleGroup({
		type: 'single'
	});

	/** @type {{ groupItems: import('../types').HourInterval[] }} */
	let { groupItems } = $props();
</script>

<div
	use:melt={$root}
	class="flex flex-wrap items-center data-[orientation='vertical']:flex-col"
	aria-label="Text alignment"
>
	{#each groupItems as gItem}
		<button
			type="button"
			class="toggle-item mb-4 mr-4 font-bold active:scale-90 active:transition-all"
			use:melt={$item({ value: gItem.label, disabled: !gItem.available })}
		>
			{gItem.label}
		</button>
	{/each}
</div>

<style lang="postcss">
	.toggle-item {
		@apply rounded-lg border bg-muted p-4 px-6;
		&:hover {
			@apply bg-background shadow-sm;
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed bg-background-alt line-through hover:bg-muted;
	}

	.toggle-item[data-state='on'] {
		@apply bg-accent-foreground;
	}
</style>
