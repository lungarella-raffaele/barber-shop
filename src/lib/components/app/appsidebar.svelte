<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import {
		Calendar,
		CircleUser,
		DollarSign,
		House,
		Instagram,
		Linkedin,
		LogOut,
		Library,
		Citrus
	} from '$lib/components/icons/index';
	import { enhance } from '$app/forms';

	let { isLogged, isAdmin } = $props();

	// Menu items.
	const navigation = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Prezzi',
			url: '/prices',
			icon: DollarSign
		},
		{
			title: 'Prenota',
			url: '/newreservation',
			icon: Calendar
		}
	];

	const user = [
		{
			title: 'Profilo',
			url: '/profile',
			icon: CircleUser
		},
		{
			title: 'Prenotazioni',
			url: '/profile/myreservations',
			icon: Library
		}
	];

	const admin = [{ title: 'Dashboard', url: '/dashboard', icon: Citrus }];

	const others = [
		{
			title: 'instagram',
			url: '#',
			icon: Instagram
		},
		{
			title: 'linkedin',
			url: '#',
			icon: Linkedin
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Vai a</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navigation as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		{#if isLogged}
			<Sidebar.Group>
				<Sidebar.GroupLabel>Area personale</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each user as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
						{#if isAdmin}
							{#each admin as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						{/if}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}

		<Sidebar.Group>
			<Sidebar.GroupLabel>Altro</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each others as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		{#if isLogged}
			<form method="post" action="/profile?/logout" use:enhance>
				<Sidebar.MenuButton class="border border-destructive text-destructive">
					<LogOut />
					<span>Esci</span>
				</Sidebar.MenuButton>
			</form>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
