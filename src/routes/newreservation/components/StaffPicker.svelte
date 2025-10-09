<script lang="ts">
	import { RadioGroup } from 'bits-ui';
	import * as Avatar from '$lib/components/ui/avatar';

	let {
		staff,
		value = $bindable()
	}: { staff: { id: string; avatar: string; name: string }[]; value: string } = $props();

	if (!value) {
		value = staff?.[0]?.id ?? '';
	}
</script>

<RadioGroup.Root bind:value class="flex flex-wrap gap-2" disabled={staff.length === 1}>
	{#each staff as member, index (index)}
		<RadioGroup.Item value={member.id}>
			{#snippet children({ checked })}
				<div
					class="flex items-center rounded-sm border p-3 transition-all duration-200 ease-in-out {checked
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
