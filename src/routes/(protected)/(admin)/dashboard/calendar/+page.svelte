<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { CirclePlus, Trash } from '$lib/components/icons/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { formatDateRange } from '$lib/utils';
	import type { CalendarDate } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let value: { start: CalendarDate; end: CalendarDate } | undefined = $state();

	const selectedPeriod = $derived(value !== undefined && value.start && value.end);

	const submit: SubmitFunction = ({ formData }) => {
		if (!value) {
			return;
		}
		formData.append('start', value.start.toString());
		formData.append('end', value.end.toString());

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Periodo di chiusura confermato!');
				invalidateAll();
			} else if (result.type === 'failure') {
				toast.error('Non è stato possibile aggiungere un servizio di chiusura');
			}
			isAddingPeriod = false;
		};
	};

	let isAddingPeriod = $state(false);
	const toggleAddPeriod = () => {
		isAddingPeriod = !isAddingPeriod;
	};

	let isDialogOpen = $state(false);
	const deleteAction = (id: string) => {
		isDialogOpen = true;
		idToDelete = id;
	};

	let idToDelete = $state('');
</script>

<svelte:head>
	<meta name="description" content="Pagina di gestione periodi di chiusura." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form action="?/delete" method="post" id="deleteForm">
	<input type="hidden" value={idToDelete} name="id" />
</form>

{#if data.periods}
	{#if data.periods.length > 0}
		<h2 class="text-lg font-bold">Periodi di chiusura inseriti:</h2>

		{#each data.periods as p (p.id)}
			<div class="my-4 flex items-center justify-between rounded-lg border bg-muted p-2">
				<span class="ml-2 font-bold">{formatDateRange(p.start, p.end)}</span>

				<Button type="button" variant="destructive" onclick={() => deleteAction(p.id)}
					><Trash />
				</Button>
			</div>
		{/each}
	{:else}
		<h2 class="my-4 text-center text-lg font-bold">Nessun periodo di chiusura inserito</h2>
	{/if}

	{#if !isAddingPeriod}
		<Button class="w-full" variant="icon" onclick={toggleAddPeriod}><CirclePlus /></Button>
	{/if}
	{#if isAddingPeriod}
		<div transition:slide class="rounded-md border shadow">
			<RangeCalendar bind:value />

			<div class="flex flex-col p-4">
				<form use:enhance={submit} method="post" action="?/create">
					<Button type="submit" class="w-full truncate" disabled={!selectedPeriod}
						>Conferma periodo di chiusura</Button
					>
				</form>

				<Button
					type="button"
					variant="ghost"
					onclick={toggleAddPeriod}
					class="mt-2 w-full truncate"
				>
					Annulla
				</Button>
			</div>
		</div>
	{/if}
{/if}

<AlertDialog.Root bind:open={isDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Annulla</AlertDialog.Cancel>
			<Button type="submit" form="deleteForm">Conferma</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
