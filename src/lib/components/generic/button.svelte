<script>
	/** @type {{children: import('svelte').Snippet, class?: string, type:"button" | "submit" | "reset" | null | undefined, [key:string]: unknown}} */
	let { children, class: className = '', type = 'button', ...others } = $props();
</script>

<button
	{...others}
	{type}
	class="shadow-mini mr-4 rounded-xl border p-4 px-9 font-bold active:scale-90 active:transition-all {className}"
>
	<span class="flew-row flex">
		{@render children()}
	</span>
</button>
