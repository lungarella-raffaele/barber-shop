<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { CirclePlus, LoaderCircle, Trash } from '$lib/components/icons/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { formatDateRange } from '$lib/utils';
	import type { CalendarDate } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button/index.js';
	import Schedule from './Schedule.svelte';
	import { onMount } from 'svelte';

	const { data }: PageProps = $props();

	let value: { start: CalendarDate; end: CalendarDate } | undefined = $state();

	const selectedPeriod = $derived(value !== undefined && value.start && value.end);

	let adding = $state(false);
	const submit: SubmitFunction = ({ formData }) => {
		if (!value) {
			return;
		}
		adding = true;
		formData.append('start', value.start.toString());
		formData.append('end', value.end.toString());
		formData.append('id', data.user.data.id);

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Periodo di chiusura confermato!');
				invalidateAll();
			} else if (result.type === 'failure') {
				toast.error('Impossibile aggiungere il periodo di chiusura.');
			}
			calendarOpen = false;
			adding = false;
			isDialogOpen = false;
		};
	};

	let deleting = $state(false);
	const submitDelete: SubmitFunction = ({ formData }) => {
		if (!idToDelete) {
			return;
		}
		formData.append('id', idToDelete);

		deleting = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Periodo di chiusura eliminato!');
				invalidateAll();
			} else if (result.type === 'failure') {
				toast.error('Impossibile eliminare il periodo di chiusura.');
			}
			calendarOpen = false;
			deleting = true;
			isDialogOpen = false;
		};
	};

	let calendarOpen = $state(false);
	const toggleAddPeriod = () => {
		calendarOpen = !calendarOpen;
	};

	let isDialogOpen = $state(false);
	const deleteAction = (id: string) => {
		isDialogOpen = true;
		idToDelete = id;
	};

	let idToDelete = $state('');

	onMount(async () => {
		console.log(await data.shutdown);
	});
</script>

<svelte:head>
	<meta name="description" content="Pagina di gestione periodi di chiusura." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form action="?/deleteShutdown" method="post" id="deleteForm" use:enhance={submitDelete}>
	<input type="hidden" value={idToDelete} name="id" />
</form>

<h2 class="mb-2 text-lg font-bold">Orario</h2>
<Schedule schedule={data.schedule} staffID={data.user.data.id} />

<hr class="my-4" />

<h2 class="mb-2 text-lg font-bold">Periodi di chiusura</h2>
{#await data.shutdown}
	<div class="my-4 flex flex-col gap-3">
		<Skeleton class="h-[50px]" />
		<Skeleton class="h-[50px]" />
	</div>
{:then shutdown}
	{#if shutdown && shutdown.length > 0}
		{#each shutdown as p (p.id)}
			<div class="my-4 flex items-center justify-between rounded-lg border bg-background p-2">
				<span class="ml-2 font-bold">{formatDateRange(p.start, p.end)}</span>

				<Button type="button" variant="destructive" onclick={() => deleteAction(p.id)}
					><Trash />
				</Button>
			</div>
		{/each}
	{:else}
		<h2 class="my-4 text-center text-lg font-bold">Nessun periodo di chiusura inserito</h2>
	{/if}
{/await}

{#if !calendarOpen}
	<Button class="w-full" variant="icon" onclick={toggleAddPeriod}>
		<CirclePlus />
	</Button>
{/if}
{#if calendarOpen}
	<div transition:slide class="rounded-md border shadow">
		<RangeCalendar bind:value />

		<div class="flex flex-col p-4">
			<form use:enhance={submit} method="post" action="?/insertShutdown">
				<Button type="submit" class="w-full truncate" disabled={!selectedPeriod || adding}>
					{#if !adding}
						Conferma periodo di chiusura
					{:else}
						<LoaderCircle class="animate-spin" />
						Attendi
					{/if}
				</Button>
			</form>

			<Button
				type="button"
				variant="ghost"
				onclick={toggleAddPeriod}
				class="mt-2 w-full truncate"
				disabled={adding}
			>
				Annulla
			</Button>
		</div>
	</div>
{/if}

<AlertDialog.Root bind:open={isDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleting}>Annulla</AlertDialog.Cancel>
			<Button disabled={deleting} type="submit" variant="destructive" form="deleteForm">
				{#if !deleting}
					Conferma
				{:else}
					<LoaderCircle class="animate-spin" />
					Attendi
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
