<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index';
	import type { User } from '$lib/server/db/schema';

	let { open = $bindable(), user }: { open: boolean; user: User } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title class="text-left">Dettaglio profilo</Dialog.Title>
		</Dialog.Header>
		<Separator />
		<Label>Nome</Label>
		{@render Info(user.firstName)}

		<Label>Cognome</Label>
		{@render Info(user.lastName)}

		<Separator />

		<Label>Email</Label>
		{@render Info(user.email)}
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#snippet Info(str: string | null)}
	<span class="text-sm text-muted-foreground">
		{#if str}
			{str}
		{:else}
			Not inserted
		{/if}
	</span>
{/snippet}
