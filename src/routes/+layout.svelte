<script lang="ts">
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import House from 'lucide-svelte/icons/house';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<main class="p-2">
	<ModeWatcher />
	<Menubar.Root class="mb-6 flex justify-between py-6">
		<Button href="/" variant="ghost" size="icon">
			<House />
		</Button>
		<Modeswitcher />
	</Menubar.Root>

	{@render children()}
</main>
