<script lang="ts">
	import Modeswitcher from './modeswitcher.svelte';
	import { CircleUser, Citrus } from '$lib/components/icons/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { enhance } from '$app/forms';
	import type { User } from '@types';

	const { user }: { user: User | null } = $props();

	let logoutForm: HTMLFormElement | undefined = $state();
</script>

<div class="mb-8 flex flex-1 items-center justify-between border-b bg-background p-3">
	<Sidebar.Trigger />
	<div class="flex items-center">
		{#if !user}
			<Button aria-label="Go to login" href="/login" variant="ghost">Login</Button>
		{:else}
			{#if user.role === 'staff'}
				<Button href="/dashboard" variant="ghost" aria-label="Go to admin dashboard">
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

<form
	bind:this={logoutForm}
	method="post"
	action="/profile?/logout"
	use:enhance
	id="logout-menubar-form"
></form>
