<script lang="ts">
	import { goto } from '$app/navigation';
	import { columns } from '$lib/components/app/datatable/column';
	import DataTable from '$lib/components/app/datatable/DataTable.svelte';
	import Timeline from './Timeline.svelte';
	import { ChartGantt, Rows3 } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn, formatDate } from '$lib/utils.js';
	import type { DateValue, CalendarDate } from '@internationalized/date';
	import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const date: CalendarDate | null = data.date ? parseDate(data.date) : null;

	let selectedDate = $state<DateValue>(date ? date : today(getLocalTimeZone()));
	const onValueChange = () => {
		if (selectedDate) {
			goto(`?date=${selectedDate}`);
			isCalendarOpen = false;
		}
	};
	let isCalendarOpen = $state(false);
	const reservations = $derived(data?.reservations);

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
						'w-[280px] justify-start rounded-md text-left font-normal',
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
	<Timeline {reservations} />
{:else}
	<DataTable data={reservations} {columns} />
{/if}
