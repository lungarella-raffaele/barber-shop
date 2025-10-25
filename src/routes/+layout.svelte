<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating, page } from '$app/state';
	import AppSidebar from './appsidebar.svelte';
	import Banner from './banner.svelte';
	import CookieBanner from './cookiebanner.svelte';
	import Footer from './footer.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { watch } from '$lib/modules/watch.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import MenuBar from './menubar.svelte';

	const { data, children } = $props();

	const isLogged = $derived(data.user !== null);
	const isAdmin = $derived(data.user?.role === 'staff');

	let openSidebar = $state(true);

	let isNavigating = $state(false);
	let navigationProgress = $state(0);
	const isMobile = new IsMobile();
	watch(
		() => navigating.complete,
		() => {
			if (navigating.complete) {
				isNavigating = true;
				navigationProgress = 0;
				// Use requestAnimationFrame to ensure the display change is rendered before the width transition starts
				requestAnimationFrame(() => {
					navigationProgress = 30;
				});
			} else if (!navigating.complete && isNavigating) {
				if (isMobile.current) openSidebar = false;

				requestAnimationFrame(() => {
					navigationProgress = 100;
				});
				setTimeout(() => {
					isNavigating = false;
					navigationProgress = 0;
				}, 300);
			}
		}
	);
</script>

<svelte:head>
	<title>{page.data.title} Emi Hair Club</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />

<Sidebar.Provider bind:open={() => openSidebar, (newOpen) => (openSidebar = newOpen)}>
	<AppSidebar {isLogged} {isAdmin} />
	{#if isNavigating}
		<Progress class="fixed top-0 z-50 h-[4px] w-full rounded-none" value={navigationProgress} />
	{/if}
	<main
		class="relative flex min-h-screen w-full flex-col px-4 sm:px-8 md:px-16 lg:px-24 xl:px-48 2xl:px-80"
	>
		<div>
			<MenuBar user={data.user} />
		</div>

		{#if data.banner?.visible}
			<Banner message={data.banner.message} />
		{/if}
		<div class="grow">
			{@render children()}
		</div>
		<Footer />
	</main>
</Sidebar.Provider>

<CookieBanner />
