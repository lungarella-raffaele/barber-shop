<script lang="ts">
	import AppSidebar from '$lib/components/app/appsidebar.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { CircleUser, LogOut } from '$lib/components/icons/index';
	import { enhance } from '$app/forms';
	import '../app.css';

	let { data, children } = $props();

	let isLogged = $derived(data.user !== null);

	let logoutForm: HTMLFormElement | undefined = $state();
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
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
							<CircleUser />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									{#snippet children()}
										<a href="/profile">Profile</a>
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet children()}
										<a href="/reservations">Prenotazioni</a>
									{/snippet}
								</DropdownMenu.Item>
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
				{@render children()}
			</div>
			<Footer />
		</div>
	</main>
</Sidebar.Provider>

<form bind:this={logoutForm} method="post" action="/profile?/logout" use:enhance></form>
