<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let api = $state<CarouselAPI>();

	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full">
	<Carousel.Content>
		{#each Array(5) as _, i (i)}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<Card.Root>
					<Card.Content class="flex aspect-square items-center justify-center p-6">
						<span class="text-4xl font-semibold">{i + 1}</span>
					</Card.Content>
				</Card.Root>
			</Carousel.Item>
		{/each}
	</Carousel.Content>

	<div class="flex justify-between py-2 text-center text-sm text-muted-foreground">
		Slide {current} of {count}

		<div>
			<Carousel.Previous />
			<Carousel.Next />
		</div>
	</div>
</Carousel.Root>
