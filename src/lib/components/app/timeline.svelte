<script lang="ts">
	import { extractHoursAndMinutes, formatTime, toDecimalHours } from '$lib/utils';
	import { getWorkingHours, WORKING_HOURS } from '$lib/working-hours';

	let {
		data
	}: {
		data: {
			id: string;
			date: string;
			hour: string;
			name: string;
			email: string;
			serviceName: string;
			serviceDuration: number;
			servicePrice: number;
		}[];
	} = $props();

	const getStartingPosition = (start: string) => {
		// 2(t-8) where t chosen time

		const { hours, minutes } = extractHoursAndMinutes(start);
		const res = 2 * (toDecimalHours(hours, minutes) - WORKING_HOURS.start.hour) * TIME_SLOT;
		return res;
	};

	const getSlotHeight = (duration: number) => {
		return duration * pixelPerMinute;
	};

	const pixelPerMinute = 2;
	const minutesPerSlot = WORKING_HOURS.slot.minute;

	const TIME_SLOT = pixelPerMinute * minutesPerSlot;
</script>

<div class="w-full max-w-md rounded-md border p-4 shadow">
	<div
		style:height="{TIME_SLOT * getWorkingHours().length}px"
		class="relative ml-16 mt-3 grid grid-cols-2 border-gray-200"
	>
		<!-- Time slots -->
		{#each getWorkingHours() as time, i}
			<div
				style:top="{TIME_SLOT * i}px"
				class="absolute -left-16 border-t text-sm text-gray-500"
			>
				{formatTime(time)}
			</div>
		{/each}

		{#each data as d}
			<div
				style:height="{getSlotHeight(d.serviceDuration)}px"
				style:top="{getStartingPosition(d.hour)}px"
				class="absolute w-full rounded border-l-4 border-primary bg-primary bg-opacity-60 p-2 text-sm text-gray-100"
			>
				<span class="font-bold">
					{d.name} | {d.serviceName}
				</span>
				<div class="text-xs text-gray-200">
					{formatTime(d.hour)} - {d.serviceDuration}min
				</div>
			</div>
		{/each}
	</div>
</div>
