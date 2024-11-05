<script>
	import { ArrowUpRight } from '$icons';

	/** @type {{href: string | undefined | null, label: string}}*/
	let { href, label } = $props();
</script>

<a {href} class="flex flex-row">
	<span class="text-5xl font-bold">{label}</span>
	<ArrowUpRight size={52} />
</a>
