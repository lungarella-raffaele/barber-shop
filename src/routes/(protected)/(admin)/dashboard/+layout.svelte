<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { page } from '$app/state';

	let { children } = $props();

	type DashBoardItem = {
		href: string;
		name: string;
	};

	const dashboardItems: DashBoardItem[] = [
		{
			href: 'reservations',
			name: 'Prenotazioni'
		},

		{
			href: 'calendar',
			name: 'Calendario'
		},
		{
			href: 'banner',
			name: 'Banner'
		}
	];

	function isItemActive(itemHref: string) {
		return page.route.id?.includes(itemHref);
	}
</script>

<h1 class="title">Admin Dashboard</h1>

<div class="mb-5 flex flex-row">
	{#each dashboardItems as dI}
		<Button
			class="{isItemActive(dI.href) ? 'bg-accent' : ''} mr-2 rounded-full"
			variant="ghost"
			href="/dashboard/{dI.href}">{dI.name}</Button
		>
	{/each}
</div>

{@render children()}
