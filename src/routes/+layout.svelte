<script lang="ts">
	import AppSidebar from '$lib/components/app/appsidebar.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { CircleUser, Citrus } from '$lib/components/icons/index';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner';
	import Banner from '$lib/components/app/banner.svelte';
	import '../app.css';

	let { data, children } = $props();

	let isLogged = $derived(data.user !== null);
	let isAdmin = $derived(data.user?.isAdmin);

	let logoutForm: HTMLFormElement | undefined = $state();
</script>

<svelte:head>
	<title>{page.data.title} Emis Barber Shop</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />

<Sidebar.Provider>
	<AppSidebar {isLogged} {isAdmin} />
	<main class="relative flex h-screen w-full flex-col">
		<div class="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-3">
			<!-- Leading -->
			<Sidebar.Trigger />
			<!-- Trailing -->
			<div class="flex items-center">
				{#if !data.user}
					<Button href="/login" variant="ghost">Login</Button>
				{:else}
					{#if data.user.isAdmin}
						<Button href="/dashboard" variant="ghost">
							<Citrus />
						</Button>
					{/if}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
							<CircleUser />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group class="flex flex-col">
								<Button
									class="m-0 justify-start p-2 text-right no-underline hover:bg-muted hover:no-underline"
									variant="link"
									href="/profile">Profilo</Button
								>
								<Button
									class="m-0 justify-start p-2 text-right no-underline hover:bg-muted hover:no-underline"
									variant="link"
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

<form bind:this={logoutForm} method="post" action="/profile?/logout" use:enhance></form>
