<script lang="ts">
	import { generateSlotsFromInterval, SlotDuration } from '$lib/modules/get-slots';
	import { extractHoursAndMinutes, formatTime, toDecimalHours } from '$lib/utils';
	import { Time } from '@internationalized/date';
	import TimelineButton from './timelinebutton.svelte';
	import type { Reservation } from '@types';

	const {
		reservations
	}: {
		reservations: Reservation[];
	} = $props();

	const day = {
		start: new Time(9, 0),
		end: new Time(19, 30)
	};
	const slots = generateSlotsFromInterval(day.start, day.end);

	const getStartingPosition = (start: string) => {
		const { hours, minutes } = extractHoursAndMinutes(start);
		const slotPerHour = 60 / SlotDuration.minute;
		const res = slotPerHour * (toDecimalHours(hours, minutes) - day.start.hour) * TIME_SLOT;
		return res;
	};

	const getSlotHeight = (duration: number) => {
		return duration * pixelPerMinute;
	};

	const pixelPerMinute = 4;
	const minutesPerSlot = 15;

	const TIME_SLOT = pixelPerMinute * minutesPerSlot;
</script>

<div class="w-full rounded-md border p-4 shadow">
	<div
		style:height="{TIME_SLOT * slots.length}px"
		class="relative ml-16 mt-3 grid grid-cols-2 border-gray-200"
	>
		<!-- Time slots -->
		{#each slots as s, i (i)}
			<div
				style:top="{TIME_SLOT * i}px"
				class="absolute -left-16 border-t text-sm text-gray-500"
			>
				{formatTime(s.start)}
			</div>
		{/each}

		{#each reservations as res (res.id)}
			<TimelineButton
				height={getSlotHeight(res.kind.duration)}
				top={getStartingPosition(res.hour)}
				reservation={res}
			/>
		{/each}
	</div>
</div>
