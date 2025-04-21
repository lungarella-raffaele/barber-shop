<script lang="ts">
	import { generateSlotsFromInterval, SlotDuration } from '$lib/get-slots';
	import { extractHoursAndMinutes, formatTime, toDecimalHours } from '$lib/utils';
	import { Time } from '@internationalized/date';
	import { Check, Shield, X } from '../icons';

	const {
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
			pending: boolean;
			isAdmin: boolean;
		}[];
	} = $props();

	const day = {
		start: new Time(9, 0),
		end: new Time(19, 30)
	};
	const slots = generateSlotsFromInterval(day.start, day.end);

	const getStartingPosition = (start: string) => {
		// 2(t-8) where t chosen time
		const { hours, minutes } = extractHoursAndMinutes(start);
		const res = 2 * (toDecimalHours(hours, minutes) - day.start.hour) * TIME_SLOT;
		return res;
	};

	const getSlotHeight = (duration: number) => {
		return duration * pixelPerMinute;
	};

	const pixelPerMinute = 2;
	const minutesPerSlot = SlotDuration.minute;

	const TIME_SLOT = pixelPerMinute * minutesPerSlot;

	type RGBA = {
		r: number;
		g: number;
		b: number;
		a: number;
	};

	// Helper function to create RGBA colors
	const rgba = (r: number, g: number, b: number, a: number = 1): RGBA => ({
		r,
		g,
		b,
		a
	});

	// Predefined color palette
	const colorPalette: RGBA[] = [
		rgba(52, 211, 153, 1), // - Emerald Green (shortest duration)
		rgba(245, 158, 11, 1), // - Amber Yellow (short-medium duration)
		rgba(255, 149, 0, 1), // - Orange (medium duration)
		rgba(239, 68, 68, 1), // - Bright Red (high duration)
		rgba(139, 92, 246, 1), // - Purple (very high duration)
		rgba(59, 130, 246, 1) // - Blue (highest duration)
	];

	const changeOpacity = (color: RGBA, newopacity: number) => {
		color.a = newopacity;
		return color;
	};

	const getColor = (duration: number): RGBA => {
		switch (duration) {
			case 20:
				return colorPalette[0];
			case 25:
				return colorPalette[1];
			case 30:
				return colorPalette[2];
			case 45:
				return colorPalette[3];
			case 60:
				return colorPalette[4];
			case 90:
				return colorPalette[5];
			default:
				return colorPalette[0];
		}
	};

	// Utility function to convert RGBA object to CSS string
	const rgbaToString = (color: RGBA): string =>
		`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
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

		{#each data as d (d.id)}
			{@const color = getColor(d.serviceDuration)}

			<div
				style:height="{getSlotHeight(d.serviceDuration)}px"
				style:top="{getStartingPosition(d.hour)}px"
				style:background-color={rgbaToString(changeOpacity(color, 0.6))}
				style:border-color={rgbaToString(color)}
				class="absolute w-full overflow-y-hidden rounded border-l-4 border-primary bg-primary bg-opacity-60 p-2 text-xs"
			>
				<a href="/{d.id}">
					<span class="flex justify-between font-bold">
						{d.name} | {d.serviceName}
						<div class="absolute right-2 top-2 flex gap-2">
							{#if !d.pending}
								<Check
									class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
									color="green"
									size={20}
									strokeWidth={3}
								/>
							{:else}
								<X
									class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
									color="red"
									size={20}
									strokeWidth={3}
								/>
							{/if}

							{#if d.isAdmin}
								<Shield
									class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
									color="green"
									size={20}
									strokeWidth={3}
								/>
							{/if}
						</div>
					</span>
					{#if d.serviceDuration >= 30}
						<div class="flex items-center text-xs text-secondary-foreground">
							{formatTime(d.hour)} - {d.serviceDuration}min
						</div>
					{/if}
				</a>
			</div>
		{/each}
	</div>
</div>
