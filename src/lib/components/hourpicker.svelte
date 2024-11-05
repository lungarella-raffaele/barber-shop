<script>
	import Separator from './generic/separator.svelte';
	import Togglegroup from './generic/togglegroup.svelte';

	/** @type {import('./types').HourInterval[]}*/
	const hours = [
		{ available: true, label: '10:00', value: 10 },
		{ available: true, label: '14:00', value: 14 },
		{ available: true, label: '16:00', value: 16 },
		{ available: false, label: '18:00', value: 18 }
	];
</script>

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		<h1 class="text-3xl font-bold">Ora</h1>
	</Separator>
	<Togglegroup groupItems={hours} />
</section>
