<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index';

	let { open = $bindable() } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title class="text-left">Dettaglio profilo</Dialog.Title>
		</Dialog.Header>
		<Separator />
		<Label>Nome</Label>
		{@render Info('Raffaele')}

		<Label>Cognome</Label>
		{@render Info('Lungarella')}

		<Separator />

		<Label>Email</Label>
		{@render Info('lungarellaraffaele@gmail.com')}
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#snippet Info(str: string)}
	<span class="text-sm text-muted-foreground">{str}</span>
{/snippet}
