<script>
	import { createSeparator, melt } from '@melt-ui/svelte';

	/** @type {{orientation: import('@melt-ui/svelte').CreateSeparatorProps['orientation'], children: import('svelte').Snippet}}*/
	let { orientation, children } = $props();

	const {
		elements: { root: separator }
	} = createSeparator({
		orientation
	});
</script>

<div>
	{@render children()}
	<div use:melt={$separator} class="my-3.5 h-[1px] w-full bg-muted"></div>
</div>
