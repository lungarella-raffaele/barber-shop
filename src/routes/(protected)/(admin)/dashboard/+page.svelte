<script lang="ts">
	import { enhance } from '$app/forms';
	import { columns } from '$lib/components/app/datatable/column';
	import DataTable from '$lib/components/app/datatable/datatable.svelte';
	import Timeline from '$lib/components/app/timeline.svelte';
	import { ChartGantt, Rows3, Search } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn, formatDate } from '$lib/utils.js';
	import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { date } from './date.svelte';

	const { form }: PageProps = $props();

	onMount(() => {
		if (selectedDate) {
			formElement?.requestSubmit();
		}
	});

	let selectedDate = $state<DateValue>(date.value ? date.value : today(getLocalTimeZone()));
	const onValueChange = () => {
		date.value = selectedDate;
		formElement?.requestSubmit();
		isCalendarOpen = false;
	};
	let isCalendarOpen = $state(false);

	let reservations = $state(form?.reservations);
	let formElement: HTMLFormElement | undefined = $state();

	const submitFunction: SubmitFunction = ({ formData }) => {
		if (selectedDate) formData.append('date', selectedDate.toString());
		return ({ result }) => {
			if (result.type === 'success' && result.data) {
				reservations = result.data.reservations;
			}
		};
	};

	type View = 'timeline' | 'list';
	let selectedView: View = $state('timeline');
	const toggleView = () => {
		if (selectedView === 'list') {
			selectedView = 'timeline';
		} else {
			selectedView = 'list';
		}
	};
</script>

<svelte:head>
	<meta
		name="description"
		content="Visualizza tutte le prenotazioni relative ad un determinato giorno."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-2 flex">
	<Popover.Root bind:open={isCalendarOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class={cn(
						'w-[280px] justify-start rounded-r-none text-left font-normal',
						!selectedDate && 'text-muted-foreground'
					)}
					{...props}
				>
					<CalendarIcon class="mr-2 size-4" />
					{selectedDate
						? formatDate(selectedDate.toString())
						: formatDate(today(getLocalTimeZone()).toString())}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar {onValueChange} bind:value={selectedDate} type="single" initialFocus />
		</Popover.Content>
	</Popover.Root>

	<form
		bind:this={formElement}
		action="?/getReservation"
		use:enhance={submitFunction}
		method="post"
	>
		<Button class="w-full rounded-l-none border-l-0" variant="icon" type="submit"
			><Search /></Button
		>
	</form>

	<Button onclick={toggleView} variant="icon" size="icon" class="ml-2">
		{#if selectedView === 'timeline'}
			<Rows3 />
		{:else}
			<ChartGantt />
		{/if}
		<span class="sr-only">Toggle view</span>
	</Button>
</div>

{#if !reservations || !reservations.length}
	<div class="rounded-md border p-4 text-center font-semibold">Nessuna prenotazione</div>
{:else if selectedView === 'timeline'}
	<Timeline data={reservations} />
{:else}
	<DataTable data={reservations} {columns} />
{/if}
