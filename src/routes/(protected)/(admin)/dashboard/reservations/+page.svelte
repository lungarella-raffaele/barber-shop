<script lang="ts">
	import type { PageProps } from './$types';

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '../../../newreservation/$types';

	let { data, form }: PageProps = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let date = $state<DateValue>();

	const submitForm = () => {
		formElement?.requestSubmit();
	};

	const submitFunction: SubmitFunction = ({ formData }) => {
		if (date) formData.append('date', date.toString());
	};

	let formElement: HTMLFormElement | undefined = $state();
</script>

<div class="flex justify-between">
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class={cn(
						'w-[280px] justify-start text-left font-normal',
						!date && 'text-muted-foreground'
					)}
					{...props}
				>
					<CalendarIcon class="mr-2 size-4" />
					{date ? df.format(date.toDate(getLocalTimeZone())) : 'Select a date'}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar bind:value={date} type="single" initialFocus />
		</Popover.Content>
	</Popover.Root>

	<form
		bind:this={formElement}
		action="?/getReservation"
		use:enhance={submitFunction}
		method="post"
	>
		<Button type="submit">Search</Button>
	</form>
</div>

{#if form}
	{#each form.reservations as r}
		{r.reservation.date}
	{/each}
{/if}
