<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import { Input } from '../ui/input';
	import { Eye, EyeClosed } from '$lib/components/icons/index';
	import Button from '../ui/button/button.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;
	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: Props = $props();

	let isPassVisible = $state(false);
	const togglePasswordVisibility = () => {
		isPassVisible = !isPassVisible;
	};
</script>

<div class="relative">
	<Button
		tabindex={-1}
		type="button"
		onclick={togglePasswordVisibility}
		variant="icon"
		class="absolute right-0 rounded-l-none"
	>
		{#if isPassVisible}
			<Eye />
		{:else}
			<EyeClosed />
		{/if}
	</Button>
	<Input
		placeholder="Password"
		bind:ref
		class={className}
		bind:value
		type={isPassVisible ? 'text' : 'password'}
		{...restProps}
	></Input>
</div>
