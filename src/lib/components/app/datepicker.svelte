<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { type DateValue } from '@internationalized/date';

	let { value = $bindable() }: { value: DateValue | undefined } = $props();
</script>

<Calendar type="single" bind:value class="rounded-md border" />
