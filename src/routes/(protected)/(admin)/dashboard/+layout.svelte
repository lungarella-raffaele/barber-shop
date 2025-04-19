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
			href: 'reservations',
			name: 'Prenotazioni'
		},

		{
			href: 'calendar',
			name: 'Calendario'
		},
		{
			href: 'general',
			name: 'Generali'
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
