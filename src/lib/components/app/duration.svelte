<script lang="ts">
	import { convertTimeFormat, minutesToTime } from '$lib/utils';
	import { duration } from 'drizzle-orm/gel-core';

	const { amount, class: className }: { amount: number; class?: string } = $props();

	function format() {
		const time = convertTimeFormat(minutesToTime(amount));
		// Split the time string by ':'
		const parts = time.toString().split(':');

		const hours = parts[0] === '00' ? null : parts[0];
		const minutes = parts[1] === '00' ? null : parts[1];

		return {
			hours: Number(hours),
			minutes: Number(minutes)
		};
	}

	const time = $derived(format());
</script>

<span class={className}>
	{#if time.hours}
		{time.hours}
		<span class="text-muted-foreground">
			{#if time.hours === 1}
				ora
			{:else}
				ore
			{/if}
		</span>
	{:else}
		{time.minutes} <span class="text-muted-foreground">min</span>
	{/if}
</span>
