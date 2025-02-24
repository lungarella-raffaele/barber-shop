<script lang="ts">
	import { extractHoursAndMinutes, formatTime, toDecimalHours } from '$lib/utils';
	import { getWorkingHours, WORKING_HOURS } from '$lib/working-hours';

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
		rgba(208, 0, 0), // Engineering Orange
		rgba(232, 93, 4), // Persimmon
		rgba(250, 163, 7), // Orange Web
		rgba(255, 186, 8), // Selective Yellow
		rgba(0, 114, 0), // Office Green 2
		rgba(56, 176, 0), // Kelly Green
		rgba(112, 224, 0), // SGBus Green
		rgba(204, 255, 51), // Lime
		rgba(0, 119, 182), // Honolulu Blue
		rgba(0, 150, 199), // Blue Green
		rgba(0, 180, 216), // Pacific Cyan
		rgba(72, 202, 228) // Vivid Sky Blue
	];

	const getRandomColor = (): RGBA => {
		const randomIndex = Math.floor(Math.random() * colorPalette.length);
		return colorPalette[randomIndex];
	};

	const changeOpacity = (color: RGBA, newopacity: number) => {
		color.a = newopacity;
		return color;
	};

	// Utility function to convert RGBA object to CSS string
	const rgbaToString = (color: RGBA): string =>
		`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
</script>

<div class="w-full rounded-md border p-4 shadow">
	<div
		style:height="{TIME_SLOT * getWorkingHours().length}px"
		class="relative ml-16 mt-3 grid grid-cols-2 border-gray-200"
	>
		<!-- Time slots -->
		{#each getWorkingHours() as time, i (i)}
			<div
				style:top="{TIME_SLOT * i}px"
				class="absolute -left-16 border-t text-sm text-gray-500"
			>
				{formatTime(time)}
			</div>
		{/each}

		{#each data as d (d.id)}
			{@const color = getRandomColor()}
			<div
				style:height="{getSlotHeight(d.serviceDuration)}px"
				style:top="{getStartingPosition(d.hour)}px"
				style:background-color={rgbaToString(changeOpacity(color, 0.7))}
				style:border-color={rgbaToString(color)}
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
