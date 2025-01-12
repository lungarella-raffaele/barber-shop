<script lang="ts">
	import AppSidebar from '$lib/components/app/appsidebar.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { data, children } = $props();

	let isLogged = $derived(data.user !== null);
</script>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar {isLogged} />
	<main class="relative flex h-screen w-full flex-col">
		<div class="sticky top-0 flex items-center justify-between border-b bg-background p-3">
			<!-- Leading -->
			<Sidebar.Trigger />
			<!-- Trailing -->
			<div class="flex items-center">
				{#if !data.user}
					<Button href="/login" variant="ghost">Login</Button>
				{:else}
					<Button href="/profile" variant="ghost">Profile</Button>
				{/if}
				<Modeswitcher />
			</div>
		</div>
		<div class="flex min-h-0 flex-1 flex-col">
			<div class="flex-1 p-3">
				{@render children()}
			</div>
			<Footer />
		</div>
	</main>
</Sidebar.Provider>
