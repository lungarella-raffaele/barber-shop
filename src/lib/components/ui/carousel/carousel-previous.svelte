<script lang="ts">
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { WithoutChildren } from 'bits-ui';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { getEmblaContext } from './context.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'outline',
		size = 'icon',
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	{variant}
	{size}
	class={cn('size-8 touch-manipulation rounded-full', className)}
	disabled={!emblaCtx.canScrollPrev}
	onclick={emblaCtx.scrollPrev}
	onkeydown={emblaCtx.handleKeyDown}
	{...restProps}
	bind:ref
>
	<ArrowLeft />
	<span class="sr-only">Previous slide</span>
</Button>
