<script lang="ts">
	import { generateSlotsFromInterval } from '$lib/modules/get-slots';
	import { Time } from '@internationalized/date';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { formatTime } from '$lib/utils';

	const day = {
		start: new Time(9, 0),
		end: new Time(19, 30)
	};
	const slots = generateSlotsFromInterval(day.start, day.end);

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

		<Skeleton class="timeline-skeleton absolute h-[100px] w-full" />
		<Skeleton class="timeline-skeleton absolute top-[150px] h-[300px] w-full" />
		<Skeleton class="timeline-skeleton absolute top-[470px] h-[80px] w-full" />
		<Skeleton class="timeline-skeleton absolute top-[600px] h-[300px] w-full" />
	</div>
</div>
