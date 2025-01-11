<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Calendar, CircleUser, DollarSign, House, LogOut } from '$lib/components/icons/index';
	import { enhance } from '$app/forms';

	let { isLogged } = $props();

	// Menu items.
	const items = [
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

	const items2 = [
		{
			title: 'Profilo',
			url: '/profile',
			icon: CircleUser
		},
		{
			title: 'Esci',
			url: '/logout',
			icon: LogOut
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Navigazione</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
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
				<Sidebar.GroupLabel>Utente</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each items2 as item (item.title)}
							{#if item.url !== '/logout'}
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
							{:else}
								<Sidebar.MenuItem>
									<form method="post" action="/profile?/logout" use:enhance>
										<Sidebar.MenuButton class="text-destructive">
											<item.icon />
											<span>{item.title}</span>
										</Sidebar.MenuButton>
									</form>
								</Sidebar.MenuItem>
							{/if}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>
</Sidebar.Root>
