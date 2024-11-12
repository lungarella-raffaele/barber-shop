<script>
	import Separator from './generic/separator.svelte';
	import Togglegroup from './generic/togglegroup.svelte';

	let { hour = $bindable('') } = $props();

	/** @type {import('./types').HourInterval[]}*/
	const hours = [
		{
			label: '10:00',
			value: '10',
			disabled: false
		},
		{
			label: '12:00',
			value: '12',
			disabled: false
		},
		{
			label: '14:00',
			value: '14',
			disabled: false
		},
		{
			label: '16:00',
			value: '16',
			disabled: false
		},
		{
			label: '18:00',
			value: '18',
			disabled: true
		}
	];
</script>

{#snippet hourSnippet(/** @type {import('./types').HourInterval} */ hour)}
	<p class="text-left p-6 py-5">{hour.label}</p>
{/snippet}

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		<h1 class="text-3xl font-bold">Ora</h1>
	</Separator>
	<Togglegroup group={hours} type="single" snippet={hourSnippet} bind:selected={hour} />
</section>
