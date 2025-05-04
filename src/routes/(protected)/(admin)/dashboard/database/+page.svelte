<script lang="ts">
	import { Check, Leaf } from '$lib/components/icons/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	const { data } = $props();
</script>

<svelte:head>
	<meta name="description" content="Pagina di gestione database." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render ExpiredEntries('Utenti', data.usersCount)}
{@render ExpiredEntries('Prenotazioni', data.reservationsCounts)}

<form method="post">
	<Button class="mt-4" type="submit">Pulisci <Leaf /></Button>
</form>

{#snippet ExpiredEntries(label: string, count: number | undefined)}
	<h2 class="mb-4 flex items-center font-bold">
		{label}
		{#if !count || count === 0}
			<Badge class="ml-2 bg-primary"><Check size={15} /></Badge>
		{:else}
			<Badge class="ml-2" variant="destructive">
				{count}
			</Badge>
		{/if}
	</h2>
{/snippet}
