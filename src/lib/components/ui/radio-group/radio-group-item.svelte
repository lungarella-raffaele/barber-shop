<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import Circle from 'lucide-svelte/icons/circle';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> & {
		value: string;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	class={cn(
		'hover:border-dark-40 aspect-square size-4 rounded-full border border-primary text-primary shadow transition-all ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="flex items-center justify-center">
			{#if checked}
				<Circle class="size-3.5 fill-primary" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
