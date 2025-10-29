<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import BadgeX from 'lucide-svelte/icons/badge-x';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();

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
		}
	];

	function isItemActive(itemHref: string) {
		return page.url.pathname === itemHref;
	}
</script>

<h1 class="title flex items-center">
	<span class="mr-2"> Dashboard </span>
	{#if data.user.role === 'staff' && data.user.data.isActive}
		<BadgeCheck class="text-primary" />
	{:else}
		<BadgeX class="text-destructive" />
	{/if}
</h1>

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
