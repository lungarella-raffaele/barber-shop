<script>
	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<button
	type="button"
	class="shadow-mini mr-4 rounded-xl border bg-accent-foreground p-4 px-9 font-bold hover:bg-accent-hover active:scale-90 active:transition-all"
>
	<span class="flew-row flex">
		{@render children()}
	</span>
</button>
