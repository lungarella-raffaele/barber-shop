<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AppSidebar from './AppSidebar.svelte';
	import Banner from './Banner.svelte';
	import CookieBanner from './CookieBanner.svelte';
	import Footer from './Footer.svelte';
	import Modeswitcher from './ModeSwitcher.svelte';
	import { CircleUser, Citrus } from '$lib/components/icons/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	const { data, children } = $props();

	const isLogged = $derived(data.user !== null);
	const isAdmin = $derived(data.user?.role === 'staff');

	let logoutForm: HTMLFormElement | undefined = $state();
</script>

<svelte:head>
	<title>{page.data.title} Emi Hair Club</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />

<Sidebar.Provider>
	<AppSidebar {isLogged} {isAdmin} />
	<main class="relative flex h-screen w-full flex-col lg:mx-60">
		<div class="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-3">
			<!-- Leading -->
			<Sidebar.Trigger />
			<!-- Trailing -->
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

		<div class="flex min-h-0 flex-1 flex-col">
			<div class="flex-1 p-3">
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
