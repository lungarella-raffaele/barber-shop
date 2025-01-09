<script lang="ts">
	import AppSidebar from '$lib/components/app/appsidebar.svelte';
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import { Instagram } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { data, children } = $props();
</script>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<div class="mb-4 flex items-center justify-between border-b p-3">
			<!-- Leading -->
			<Sidebar.Trigger />

			<!-- Trailing -->
			<div class="flex items-center">
				{#if !data.user}
					<Button href="/login" variant="ghost">Login</Button>
				{/if}

				<Button href="" target="_blank" variant="ghost" size="icon"><Instagram /></Button>
				<Modeswitcher />
			</div>
		</div>

		<div class="p-2">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>
