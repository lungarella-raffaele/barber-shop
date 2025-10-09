<script lang="ts" module>
	import { cn } from '$lib/utils';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const calloutVariants = tv({
		base: 'flex flex-col items-center justify-center rounded border-l-4 border-muted-foreground bg-gray-50 p-8',
		variants: {
			variant: {
				default: 'text-foreground',
				destructive:
					'border-destructive dark:border-destructive [&>svg]:text-destructive  bg-red-50 dark:bg-red-900',
				success:
					'border-primary bg-green-50 dark:bg-green-900 dark:border-primary [&>svg]:text-primary'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type CalloutVariant = VariantProps<typeof calloutVariants>['variant'];
</script>

<script lang="ts">
	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: CalloutVariant;
	} = $props();
</script>

<div bind:this={ref} class={cn(calloutVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</div>
