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

<h1 class="title">Dashboard</h1>

<ul class="mb-5 flex flex-row gap-2">
	{#each dashboardItems as dI (dI.name)}
		<li
			class={isItemActive(dI.href)
				? 'underline decoration-primary decoration-2 underline-offset-[16px]'
				: ''}
		>
			<Button href="/dashboard/{dI.href}" variant="ghost">
				{dI.name}
			</Button>
		</li>
	{/each}
</ul>

{@render children()}
