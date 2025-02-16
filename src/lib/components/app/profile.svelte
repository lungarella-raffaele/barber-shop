<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { User } from '$lib/server/db/schema';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';

	const { user }: { user: User } = $props();

	let isOpen = $state(false);

	const submitFunction: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success('Account eliminato');
				await invalidateAll();
				goto('/');
			} else {
				toast.error(`Non è stato possibile eliminare l'account riprova più tardi`);
			}
			isOpen = false;
		};
	};
</script>

<h1 class="title">Profilo</h1>
<Card.Root class="mb-5">
	<Card.Header>
		<Card.Title>Informazioni personali</Card.Title>
	</Card.Header>
	<Card.Content>
		<form>
			<Label for="name">Nome</Label>
			<Input class="mb-4" id="name" value={user.name} placeholder="Il tuo nome" disabled />

			<Label for="name">Numero di telefono</Label>
			<Input
				class="mb-4"
				id="name"
				value={user.phoneNumber ? user.phoneNumber : 'Nessuna informazione'}
				placeholder="Il tuo numero di cellulare"
				disabled
			/>

			<Label for="name">Email</Label>
			<Input id="name" value={user.email} placeholder="La tua email" disabled />
		</form>
	</Card.Content>
</Card.Root>

<Card.Root class="border-destructive">
	<Card.Header>
		<Card.Title>Elimina account</Card.Title>
		<Card.Description>
			Tutte le informazioni relative al tuo profilo saranno eliminate, l'azione non è
			reversibile.
		</Card.Description>
	</Card.Header>
	<Card.Content
		class="mt-4 rounded-b-lg border-t border-destructive bg-red-300 bg-opacity-15 py-4"
	>
		<Button onclick={() => (isOpen = true)} class={buttonVariants({ variant: 'destructive' })}
			>Elimina account</Button
		>
	</Card.Content>
</Card.Root>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
			<AlertDialog.Description>
				Tutte le tue prenotazioni, passate e future verrano eliminate
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Annulla</AlertDialog.Cancel>
			<form action="?/deleteAccount" method="post" use:enhance={submitFunction}>
				<AlertDialog.Action class="{buttonVariants({ variant: 'destructive' })} w-full">
					Elimina account
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
