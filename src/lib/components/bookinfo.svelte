<script>
	import { ArrowRight } from '$icons/index';
	import { formatToITLocale } from '$lib/utils';
	import { getLocalTimeZone } from '@internationalized/date';
	import Button from './generic/button.svelte';
	/**
	 * @type {{ name: string, email: string, phoneNumber:string, hour: string, date: import('@internationalized/date').CalendarDate | undefined}}
	 */
	let { name, email, phoneNumber, hour, date } = $props();
</script>

<div
	class="sticky bottom-8 z-50 mx-24 mb-24 rounded-full border bg-background bg-opacity-95 py-4 pl-12"
>
	<div class="flex flex-row justify-between">
		<div>
			<div>
				<span class="font-bold">{name}</span>
				<br />
				<span class="font-semibold text-muted-foreground">{email}</span>
			</div>
			{phoneNumber}
			{#if date}
				{formatToITLocale(date.toDate(getLocalTimeZone()))}
			{/if}
			alle ore
			{hour}
		</div>
		<Button type="submit" class="rounded-full bg-accent p-0 text-background">
			<ArrowRight size={30} strokeWidth={3} />
		</Button>
	</div>
</div>
