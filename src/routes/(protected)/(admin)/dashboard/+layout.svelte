<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index';

	const { children } = $props();

	type DashBoardItem = {
		href: string;
		name: string;
	};

	const dashboardItems: DashBoardItem[] = [
		{
			href: '/dashboard',
			name: 'Prenotazioni'
		},

		{
			href: '/dashboard/calendar',
			name: 'Calendario'
		},
		{
			href: '/dashboard/general',
			name: 'Generali'
		},
		{
			href: '/dashboard/database',
			name: 'Database'
		}
	];

	function isItemActive(itemHref: string) {
		return page.url.pathname === itemHref;
	}
</script>

<h1 class="title">Dashboard</h1>

<div class="rounded-md border p-4 shadow">
	<ul class="mb-3 flex flex-row gap-2 overflow-auto">
		{#each dashboardItems as dI (dI.name)}
			<li class={isItemActive(dI.href) ? 'text-white-500' : 'text-muted-foreground'}>
				<Button href={dI.href} variant="ghost">
					{dI.name}
				</Button>
			</li>
		{/each}
	</ul>
	<hr class="mb-4" />

	{@render children()}
</div>
