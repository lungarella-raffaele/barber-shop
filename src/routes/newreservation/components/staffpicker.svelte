<script lang="ts">
	import { RadioGroup } from 'bits-ui';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { Staff } from '@types';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';

	let { staff, value = $bindable() }: { staff: Promise<Staff[] | null>; value: string } =
		$props();

	async function init() {
		if (!value) {
			value = (await staff)?.[0]?.id ?? '';
		}
	}

	onMount(async () => {
		await init();
	});

	const rm = ReservationManager.get();
</script>

<svelte:boundary>
	{#await staff}
		<div class="flex gap-2">
			<Skeleton class="h-[66px] w-[132px] rounded-md" />
			<Skeleton class="h-[66px] w-[132px] rounded-md" />
		</div>
	{:then data}
		<RadioGroup.Root
			bind:value
			class="flex flex-wrap gap-2"
			disabled={data?.length === 1}
			onValueChange={() => {
				rm.data.date = '';
				rm.data.hour = '';
				rm.data.kind = '';
			}}
		>
			{#each data ?? [] as member, index (index)}
				<RadioGroup.Item value={member.id}>
					{#snippet children({ checked })}
						<div
							class="flex items-center rounded-sm border p-3 transition-all duration-200 ease-in-out hover:border-primary {checked
								? 'border border-primary bg-primary-foreground shadow-lg'
								: ''}"
						>
							<Avatar.Root>
								<Avatar.Image src={member.avatar}></Avatar.Image>
								<Avatar.Fallback class="border border-muted"
									>{member.name.toUpperCase().substring(0, 2)}</Avatar.Fallback
								>
							</Avatar.Root>
							<span class="ml-2 font-semibold">{member.name}</span>
						</div>
					{/snippet}
				</RadioGroup.Item>
			{/each}
		</RadioGroup.Root>
	{/await}
</svelte:boundary>
