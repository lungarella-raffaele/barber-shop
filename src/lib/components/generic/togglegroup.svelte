<script>
	import { createToggleGroup, melt } from '@melt-ui/svelte';

	/** @typedef {import('../types').ToggleGroup} ToggleGroup*/
	/** @typedef {import('../types').ToggleItem} ToggleItem*/

	/** @type {{ group: ToggleGroup, type: import('@melt-ui/svelte').ToggleGroupType, snippet?: import('svelte').Snippet<[any]>, selected: unknown, class?: string}} */
	let { group, type = 'single', snippet, selected = $bindable(), class: className = '' } = $props();

	const {
		elements: { root, item },
		states: { value }
	} = createToggleGroup({
		type
	});

	$effect(() => {
		selected = $value;
	});
</script>

<div
	use:melt={$root}
	class="flex data-[orientation='vertical']:flex-col {className} flex-wrap"
	aria-label="Text alignment"
>
	{#each group as groupItem}
		{@const { value, disabled } = groupItem}
		{#if value}
			<button
				type="button"
				class="toggle-item mb-4 mr-4 w-full font-bold transition-all active:scale-90 md:w-auto"
				use:melt={$item({ value, disabled })}
			>
				{#if snippet}
					{@render snippet(groupItem)}
				{:else}
					{value}
				{/if}
			</button>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.toggle-item {
		@apply rounded-lg border bg-muted;
		&:hover {
			@apply bg-background shadow-md;
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed bg-background-alt line-through hover:bg-muted;
	}
	.toggle-item[data-state='on'] {
		@apply bg-accent text-background;
	}
</style>
