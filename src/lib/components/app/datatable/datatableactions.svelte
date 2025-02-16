<script lang="ts">
	import { Ellipsis } from '$lib/components/icons/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	const { id }: { id: string } = $props();

	let isDialogOpen = $state(false);

	const openDialog = () => {
		isDialogOpen = true;
	};

	const closeDialog = () => {
		isDialogOpen = false;
	};

	const submitDelete: SubmitFunction = async () => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				await invalidateAll();
				toast.success('Prenotazione eliminata');
			} else if (result.type === 'failure') {
				toast.error(`Errore durante l'eliminazione della prenotazione. Riprova più tardi`);
			}

			isDialogOpen = false;
		};
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group class="flex flex-col">
			<Button
				class="m-0 justify-start p-2 text-right no-underline hover:bg-muted hover:no-underline"
				variant="link"
				href="/{id}">Vedi dettaglio</Button
			>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={openDialog} class="text-destructive">Elimina</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-left"
				>Sei sicuro di voler disdire l'appuntamento?</Dialog.Title
			>
			<Dialog.Description class="text-left">L'azione è irreversibile.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<div class="flex flex-row-reverse">
				<form action="?/delete" method="post" use:enhance={submitDelete}>
					<input type="hidden" name="id" value={id} />
					<Button class="ml-2" aria-label="Conferma" type="submit" variant="destructive"
						>Conferma</Button
					>
				</form>

				<Button variant="outline" onclick={closeDialog}>Chiudi</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
