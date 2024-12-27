<script>
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';
	import Profile from '$lib/components/app/profile.svelte';
	import { House, LogOut, User } from '$lib/components/icons/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';

	let { user } = $props();

	let profileDialog = $state(false);
	const toggleDialog = () => {
		profileDialog = !profileDialog;
	};
</script>

<div class="sticky mb-4 flex items-center justify-between border-b p-3">
	<!-- LEADING -->
	<div class="flex items-center">
		<Button href="/" variant="ghost" size="icon">
			<House />
		</Button>
	</div>

	<!-- TRAILING -->
	<div class="flex items-center">
		{#if !user}
			<Button href="/login" variant="ghost">Login</Button>
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
					<span class="font-bold">
						{user.email.slice(0, 1).toUpperCase()}
					</span>
				</DropdownMenu.Trigger>
				<a href="/book">Prenota</a>
				<a href="/book">Listino</a>
				<DropdownMenu.Content>
					<DropdownMenu.Item onSelect={toggleDialog}>
						<User class="mr-2 size-4" />
						<span>Profile</span>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<a class="flex items-center" href="/logout" data-sveltekit-reload aria-label="Logout">
							<LogOut class="mr-2 size-4" />
							<span>Log out</span>
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
		<Modeswitcher />
	</div>
</div>

<!-- Profile Dialog -->
{#if user}
	<Profile bind:open={profileDialog} {user} />
{/if}
