<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { Input } from '../ui/input';
	import { Eye, EyeClosed } from '$lib/components/icons/index';
	import Button from '../ui/button/button.svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();

	let passwordType = $state('password');
	const togglePasswordVisibility = () => {
		passwordType = passwordType === 'password' ? 'text' : 'password';
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
		{#if passwordType === 'password'}
			<EyeClosed />
		{:else}
			<Eye />
		{/if}
	</Button>
	<Input bind:ref class={className} bind:value type={passwordType} {...restProps}></Input>
</div>
