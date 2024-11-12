<script>
	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<button
	type="button"
	class="shadow-mini mr-4 rounded-xl border p-4 px-9 font-bold active:scale-90 active:transition-all"
>
	<span class="flew-row flex">
		{@render children()}
	</span>
</button>
