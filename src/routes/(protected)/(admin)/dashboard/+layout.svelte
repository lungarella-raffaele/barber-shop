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

<ul class="mb-5 flex flex-row gap-2 overflow-auto">
	{#each dashboardItems as dI (dI.name)}
		<li
			class={isItemActive(dI.href)
				? 'mb-4 underline decoration-primary decoration-2 underline-offset-[16px]'
				: ''}
		>
			<Button href={dI.href} variant="ghost">
				{dI.name}
			</Button>
		</li>
	{/each}
</ul>

<div class="mb-4 rounded-md border p-4 shadow">
	{@render children()}
</div>
