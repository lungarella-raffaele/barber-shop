<script>
	import { createCalendar, melt } from '@melt-ui/svelte';
	import { ChevronRight, ChevronLeft } from '$icons/index.js';
	import { today, getLocalTimeZone, getDayOfWeek } from '@internationalized/date';
	import { capitalize, DayOfTheWeek, formatToITLocale } from '$lib/utils';
	import Separator from './generic/separator.svelte';

	/**
	 * Returs the first Calendar Date available
	 * @return {import('@internationalized/date').CalendarDate}
	 */
	const findFirstAvailableDate = () => {
		let date = today(getLocalTimeZone());
		if (getDayOfWeek(date, 'it-IT') === DayOfTheWeek.MONDAY) {
			date = date.add({ days: 1 });
		}
		return date;
	};

	/**
	 * Returs the first Calendar Date available
	 * @param {import('@internationalized/date').DateValue} date
	 * @returns {boolean}
	 */
	const dateMatcher = (date) => {
		return (
			getDayOfWeek(date, 'it-IT') === DayOfTheWeek.MONDAY ||
			date.compare(today(getLocalTimeZone())) < 0
		);
	};

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, weekdays, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultValue: findFirstAvailableDate(),
		fixedWeeks: true,
		preventDeselect: true,
		locale: 'it',
		isDateUnavailable: (date) => {
			return dateMatcher(date);
		}
	});

	/** @type {{date: import("@internationalized/date").CalendarDate | undefined}}*/
	let { date = $bindable() } = $props();

	$effect(() => {
		date = $value;
	});
</script>

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		{#if date}
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<h1 class="text-3xl font-bold">Data</h1>
				</div>
				<h2>
					{formatToITLocale(date.toDate(getLocalTimeZone()))}
				</h2>
			</div>
		{/if}
	</Separator>
	<div use:melt={$calendar}>
		<header class="flex items-center justify-between">
			<button use:melt={$prevButton}>
				<ChevronLeft size={24} />
			</button>
			<div use:melt={$heading}>
				{capitalize($headingValue)}
			</div>
			<button use:melt={$nextButton}>
				<ChevronRight size={24} />
			</button>
		</header>
		<div>
			{#each $months as month}
				<table use:melt={$grid}>
					<thead aria-hidden="true">
						<tr>
							{#each $weekdays as day}
								<th>
									<div>
										{day}
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each month.weeks as weekDates}
							<tr>
								{#each weekDates as date}
									<td
										role="gridcell"
										aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}
									>
										<div use:melt={$cell(date, month.value)}>
											{date.day}
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	[data-melt-calendar] {
		@apply w-full rounded-lg p-3;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-8;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg bg-background-alt p-1 transition-all hover:bg-muted;
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg bg-background-alt p-1 transition-all hover:bg-muted;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold text-foreground-alt;
	}

	th {
		@apply text-sm font-bold;

		& div {
			@apply flex h-6 w-6 items-center justify-center p-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full;
	}

	[data-melt-calendar-cell] {
		@apply data-[selected]:bg-accent relative inline-flex size-10 items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-transparent p-0 text-sm font-normal text-foreground hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply opacity-0;
	}
</style>
