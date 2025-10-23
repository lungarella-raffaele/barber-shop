<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating, page } from '$app/state';
	import AppSidebar from './appsidebar.svelte';
	import Banner from './banner.svelte';
	import CookieBanner from './cookiebanner.svelte';
	import Footer from './footer.svelte';
	import Modeswitcher from './modeswitcher.svelte';
	import { CircleUser, Citrus } from '$lib/components/icons/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { watch } from '$lib/modules/watch.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	const { data, children } = $props();

	const isLogged = $derived(data.user !== null);
	const isAdmin = $derived(data.user?.role === 'staff');

	let openSidebar = $state(true);
	let logoutForm: HTMLFormElement | undefined = $state();

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
	<main class="2xl:mx-120 relative min-h-screen w-full px-4 md:mx-0 lg:mx-20 lg:px-0 xl:mx-60">
		<!-- Menu -->
		<div
			class="sticky top-0 z-40 mb-8 flex items-center justify-between border-b bg-background p-3"
		>
			<Sidebar.Trigger />
			<div class="flex items-center">
				{#if !data.user}
					<Button aria-label="Go to login" href="/login" variant="ghost">Login</Button>
				{:else}
					{#if data.user.role === 'staff'}
						<Button
							href="/dashboard"
							variant="ghost"
							aria-label="Go to admin dashboard"
						>
							<Citrus />
						</Button>
					{/if}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							aria-label="Open dropdown"
							class={buttonVariants({ variant: 'ghost' })}
						>
							<CircleUser />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group class="flex flex-col">
								<Button
									class="m-0 justify-start p-2 text-right no-underline hover:bg-muted hover:no-underline"
									variant="link"
									aria-label="Go to profile"
									href="/profile">Profilo</Button
								>
								<Button
									class="m-0 justify-start p-2 text-right no-underline hover:bg-muted hover:no-underline"
									variant="link"
									aria-label="Go to my reservations"
									href="profile/myreservations">Prenotazioni</Button
								>
								<DropdownMenu.Separator />

								<DropdownMenu.Item
									class="text-destructive"
									onSelect={() => logoutForm?.requestSubmit()}
								>
									Esci
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
				<Modeswitcher />
			</div>
		</div>

		<div class="flex flex-1 flex-col">
			<div class="flex-1">
				{#if data.banner?.visible}
					<Banner message={data.banner.message} />
				{/if}
				{@render children()}
			</div>
			<Footer />
		</div>
	</main>
</Sidebar.Provider>

<CookieBanner />

<form
	bind:this={logoutForm}
	method="post"
	action="/profile?/logout"
	use:enhance
	id="logout-menubar-form"
></form>
