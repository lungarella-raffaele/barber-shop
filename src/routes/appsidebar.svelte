<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import {
		ArrowUpRight,
		Calendar,
		CircleUser,
		Citrus,
		Euro,
		House,
		Instagram,
		Library,
		LogOut,
		MapPin
	} from '$lib/components/icons/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';

	const { isLogged, isAdmin } = $props();

	type MenuItem = {
		title: string;
		url: string;
		icon: typeof House;
	};

	// Menu items.
	const navigation: MenuItem[] = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Prezzi',
			url: '/prices',
			icon: Euro
		},
		{
			title: 'Prenota',
			url: '/newreservation',
			icon: Calendar
		}
	];

	const user = [
		{
			title: 'Prenotazioni',
			url: '/profile/myreservations',
			icon: Library
		},
		{
			title: 'Profilo',
			url: '/profile',
			icon: CircleUser
		}
	];

	const admin = [{ title: 'Dashboard', url: '/dashboard', icon: Citrus }];

	const others = [
		{
			title: 'instagram',
			url: BARBER_SHOP_DETAILS.instagram,
			icon: Instagram
		},
		{
			title: 'Posizione',
			url: BARBER_SHOP_DETAILS.google_page,
			icon: MapPin
		}
	];
</script>

<Sidebar.Root variant="sidebar">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Vai a</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navigation as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={item.url === page.url.pathname}>
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
						{#if isAdmin}
							{#each admin as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={item.url === page.url.pathname}>
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
						{#each user as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.url === page.url.pathname}>
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
		{/if}

		<Sidebar.Group>
			<Sidebar.GroupLabel>Altro</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each others as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props} target="_blank">
										<item.icon />
										<span>{item.title}</span>
										<ArrowUpRight />
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
			<form method="post" action="/profile?/logout" use:enhance id="sidebar-logout-form">
				<Sidebar.MenuButton class="text-destructive">
					<LogOut />
					<span>Esci</span>
				</Sidebar.MenuButton>
			</form>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
