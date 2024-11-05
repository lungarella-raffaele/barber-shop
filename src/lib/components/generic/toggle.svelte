<script lang="ts">
	import { createToggle, melt } from '@melt-ui/svelte';

	const {
		elements: { root }
	} = createToggle({
		disabled: true
	});

	/** @type {{children: import('svelte').Snippet, disabled: boolean}} */
	let { children, disabled } = $props();
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="shadow-mini mr-4 rounded-xl border bg-background-alt p-4 px-9 font-bold hover:bg-muted active:scale-90 active:transition-all data-[disabled]:cursor-not-allowed data-[state=on]:bg-accent-foreground"
>
	<span class="flex flex-row">
		{@render children()}
	</span>
</button>
