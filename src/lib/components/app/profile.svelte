<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { User } from '$lib/server/db/schema';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { user }: { user: User } = $props();

	let enableModify = $state(false);
</script>

<h1 class="title">Profilo</h1>
<Card.Root class="mb-5">
	<Card.Header>
		<Card.Title>Informazioni personali</Card.Title>
		<Card.Description>Queste sono le tue informazioni personali</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="username">Username</Label>
					<Input
						id="username"
						value={user.username}
						placeholder="Il tuo username"
						disabled={!enableModify}
					/>

					<Label for="name">Numero di telefono</Label>
					<Input
						id="name"
						value={user.phoneNumber ? user.phoneNumber : 'Nessuna informazione'}
						placeholder="Il tuo numero di cellulare"
						disabled={!enableModify}
					/>

					<Label for="name">Email</Label>
					<Input id="name" value={user.email} placeholder="La tua email" disabled={!enableModify} />
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		{#if enableModify}
			<Button onclick={() => (enableModify = false)} variant="outline">Cancel</Button>
			<Button>Salva</Button>
		{:else}
			<Button onclick={() => (enableModify = true)}>Modifica</Button>
		{/if}
	</Card.Footer>
</Card.Root>

<Card.Root class="border-destructive">
	<Card.Header>
		<Card.Title>Elimina account</Card.Title>
		<Card.Description>
			Tutte le informazioni relative al tuo profilo saranno eliminate, l'azione non è reversibile.
		</Card.Description>
	</Card.Header>
	<Card.Content class="mt-4 rounded-b-lg border-t border-destructive bg-red-300 bg-opacity-15 py-4">
		<Button variant="destructive" type="submit">Elimina account</Button>
	</Card.Content>
</Card.Root>
