<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Button } from '$lib/components/ui/button/index';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import { formatDateRange } from '$lib/utils';
	import { CirclePlus, Trash } from '$lib/components/icons/index';
	import { slide } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

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
				toast.error('Contatta Raffaele');
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

<AlertDialog.Root bind:open={isDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancella</AlertDialog.Cancel>
			<Button type="submit" form="deleteForm">Conferma</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<form action="?/delete" method="post" id="deleteForm">
	<input type="hidden" value={idToDelete} name="id" />
</form>

<div class="mb-4 rounded-md border p-4 shadow">
	{#if data.periods}
		Periodi di chiusura inseriti:
		{#each data.periods as p (p.id)}
			<div class="my-4 flex items-center justify-between rounded border p-2">
				<span class="ml-2 font-bold">{formatDateRange(p.start, p.end)}</span>

				<Button
					type="button"
					variant="ghost"
					class="text-destructive"
					onclick={() => deleteAction(p.id)}
					><Trash />
				</Button>
			</div>
		{/each}

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
</div>
