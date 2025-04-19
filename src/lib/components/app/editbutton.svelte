<script>
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import Pencil from 'lucide-svelte/icons/pencil';

	let { pressed = $bindable(), onclick } = $props();
</script>

<Toggle
	{onclick}
	bind:pressed
	aria-label="toggle edit"
	class="bold border data-[state=on]:bg-primary"
>
	<Pencil />
</Toggle>
