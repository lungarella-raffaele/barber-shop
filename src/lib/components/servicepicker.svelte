<script>
	import Separator from './generic/separator.svelte';
	import Togglegroup from './generic/togglegroup.svelte';

	/** @type {import ('./types').Service[]}*/
	const services = [
		{
			value: '1',
			label: 'Taglio di capelli classico',
			time: 30,
			cost: 22,
			disabled: false
		},
		{
			value: '2',
			label: 'Taglio di capelli & Rifinitura barba',
			time: 30,
			cost: 23,
			disabled: false
		},
		{
			value: '3',
			label: 'Taglio & Scolpitura barba',
			time: 45,
			cost: 25,
			disabled: false
		},
		{
			value: '4',
			label: 'Taglio bambino (0-10 anni)',
			time: 15,
			cost: 15,
			disabled: false
		},
		{
			value: '5',
			label: 'Taglio di capelli per ragazzo (11-12-13 anni)',
			time: 25,
			cost: 18,
			disabled: false
		}
	];

	/** @type {string} searchInput */
	let searchInput = $state('');

	let filteredServices = $derived(
		services.filter((s) => {
			if (!searchInput) {
				return s;
			}
			const sanitizedInputSearch = searchInput.toLowerCase();
			const sanitizedServiceLabel = s.label.toLowerCase();
			if (sanitizedServiceLabel.includes(sanitizedInputSearch)) {
				return s;
			}
		})
	);

	let service = $state('');
</script>

{#snippet name(/** @type {import ('./types').Service} */ service)}
	<div class="relative p-4">
		<div class="h-28 w-full md:w-40">
			<div class="flex flex-col items-start">
				<p class="text-left">{service.label}</p>
				<p class="font-normal text-muted-foreground">{service.time} min</p>
			</div>
		</div>
		<div class="absolute bottom-4 right-0 rounded-l-lg bg-muted-foreground px-4 py-1">
			{service.cost}$
		</div>
	</div>
{/snippet}

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		<h1 class="text-3xl font-bold">Servizi</h1>
	</Separator>
	<Togglegroup
		group={filteredServices}
		type="single"
		snippet={name}
		class="w-full flex-wrap"
		bind:selected={service}
	/>
</section>
