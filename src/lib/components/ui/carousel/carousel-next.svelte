<script lang="ts">
	import { ArrowRight } from '$lib/components/icons/index.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { WithoutChildren } from 'bits-ui';
	import { getEmblaContext } from './context.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'outline',
		size = 'icon',
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext('<Carousel.Next/>');
</script>

<Button
	{variant}
	{size}
	class={cn('size-8 touch-manipulation rounded-full', className)}
	disabled={!emblaCtx.canScrollNext}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	bind:ref
	{...restProps}
>
	<ArrowRight />
	<span class="sr-only">Next slide</span>
</Button>
