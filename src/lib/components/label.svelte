<script>
	import { createLabel, melt } from '@melt-ui/svelte';

	/** @type {{children: import('svelte').Snippet, text: string}} */
	let { children, text } = $props();

	const {
		elements: { root }
	} = createLabel();
</script>

<div class="flex flex-col items-start justify-center">
	<label use:melt={$root} for="email" class="mb-0.5 font-medium" data-melt-part="root">
		<span>{text}</span>
	</label>
	{@render children()}
</div>
