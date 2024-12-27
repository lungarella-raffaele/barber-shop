<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { type Service, services } from '$lib/models/service.model';

	let api = $state<CarouselAPI>();

	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	// const count = $derived(api ? api.scrollSnapList().length : 0);

	let value: number | undefined = $state();
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full">
	<Carousel.Content>
		{#each services as service (service.id)}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<Card.Root>
					{@render ServiceItem(service)}
				</Card.Root>
			</Carousel.Item>
		{/each}
	</Carousel.Content>

	<div class="flex justify-between py-2 text-center text-sm text-muted-foreground">
		Servizio {current} di {services.length}

		<div>
			<Carousel.Previous />
			<Carousel.Next />
		</div>
	</div>
</Carousel.Root>

{#snippet ServiceItem(service: Service)}
	<button
		onclick={() => {
			if (value === service.id) {
				value = undefined;
			} else {
				value = service.id;
			}
		}}
		class="h-full w-full rounded-lg {value === service.id ? 'bg-muted-foreground' : ''}"
	>
		<Card.Content class="flex aspect-square items-center justify-center p-6">
			<span class="text-4xl font-semibold">{service.name}</span>
		</Card.Content>
	</button>
{/snippet}
