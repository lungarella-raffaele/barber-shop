<script lang="ts">
	import { enhance } from '$app/forms';
	import EditButton from '$lib/components/app/editbutton.svelte';
	import { Check, CirclePlus, Save, Trash, X } from '$lib/components/icons/index';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { DBKind } from '@types';
	import { slide } from 'svelte/transition';

	let { kinds }: { kinds: DBKind[] } = $props();

	const kindBackup = kinds;

	let isEditing = $state(false);
	let whoIsOpen = $state('');

	const handleEditToggle = () => {
		kinds = kindBackup.map((s) => ({ ...s }));
	};

	let isAddingKind = $state(false);
	const toggleAddKind = () => {
		isAddingKind = !isAddingKind;
	};
</script>

<h2 class="mb-2 text-lg font-bold">Servizi</h2>
<Accordion.Root type="single" bind:value={whoIsOpen} class="mb-8">
	{#each kinds as kind}
		{@render KindItem(kind)}
	{/each}
</Accordion.Root>

{#if !isAddingKind}
	<Button class="w-full" variant="secondary" onclick={toggleAddKind}
		><CirclePlus />Aggiungi servizio</Button
	>
{/if}
{#if isAddingKind}
	<div transition:slide class="rounded-md border shadow">
		<div class="flex flex-col p-4">
			<h2 class="mb-4 p-2 text-lg font-bold">Aggiungi servizio</h2>
			<form action="?/addKind" id="adding-kind-form" method="post">
				<Label for="new-kind-name">Nome</Label>
				<Input id="new-kind-name" type="text" placeholder="Nome" name="name" class="mb-4" />

				<Label for="new-kind-description">Descrizione</Label>
				<Textarea
					id="new-kind-description"
					placeholder="Descrizione del servizio"
					name="description"
					class="mb-4"
				/>

				<Label for="new-kind-duration">Durata</Label>
				<Input
					id="new-kind-duration"
					placeholder="Durata del servizio"
					name="duration"
					class="mb-4"
					type="number"
				/>

				<Label for="new-kind-price">Prezzo</Label>
				<Input
					id="new-kind-price"
					placeholder="Prezzo del servizio"
					type="number"
					name="price"
					class="mb-4"
				/>

				<div class="mt-4 flex items-center">
					<Switch id="new-kind-active" name="active" />
					<Label class="mb-0" for="new-kind-active">Disponibilità</Label>
				</div>

				<div class="mt-8 flex w-full flex-row-reverse gap-2">
					<Button type="submit">
						<Save />
						Salva
					</Button>

					<Button type="button" variant="secondary" onclick={toggleAddKind}>
						Annulla
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#snippet KindItem(kind: DBKind)}
	<Accordion.Item value={kind.id} disabled={isEditing}>
		<Accordion.Trigger>
			<h1 class="flex items-center">
				<span class="mr-2">
					{kind.name}
				</span>

				{#if kind.active}
					<Check size={17} color="green" />
				{:else}
					<X color="red" size={17} />
				{/if}
			</h1>
		</Accordion.Trigger>
		<Accordion.Content class="rounded-lg py-4">
			<form action="?/updateKind" id={kind.id + '-form'} method="post">
				<input type="hidden" value={kind.id} name="id" />
				<Label for={kind.id + '-name'}>Nome</Label>
				<Input
					disabled={!isEditing}
					id={kind.id + '-name'}
					value={kind.name}
					type="text"
					placeholder="Nome"
					name="name"
					class="mb-4"
				/>

				<Label for={kind.id + '-description'}>Descrizione</Label>
				<Textarea
					disabled={!isEditing}
					id={kind.id + '-description'}
					value={kind.description}
					placeholder="Descrizione del servizio"
					name="description"
					class="mb-4"
				/>

				<Label for={kind.id + '-duration'}>Durata</Label>
				<Input
					id={kind.id + '-duration'}
					disabled={!isEditing}
					value={kind.duration}
					placeholder="Durata del servizio"
					name="duration"
					class="mb-4"
				/>

				<Label for={kind.id + '-price'}>Prezzo</Label>
				<Input
					disabled={!isEditing}
					id={kind.id + '-price'}
					value={kind.price}
					placeholder="Prezzo del servizio"
					type="number"
					name="price"
					class="mb-4"
				/>

				<div class="mt-4 flex items-center space-x-2">
					<Switch
						id={kind.id + '-active'}
						checked={kind.active}
						disabled={!isEditing}
						name="active"
					/>

					<Label class="mb-0" for={kind.id + '-active'}>Disponibilità</Label>
				</div>

				<div class="mt-8 flex justify-between">
					<div class="flex gap-2">
						<Button variant="destructive" type="submit" form="{kind.id}-delete-kind">
							<Trash />
						</Button>
						<Button type="submit" class="mr-4" disabled={!isEditing}>
							<Save />
							Aggiorna
						</Button>
					</div>

					<EditButton bind:pressed={isEditing} onclick={handleEditToggle} />
				</div>
			</form>

			<form action="?/deleteKind" method="post" id="{kind.id}-delete-kind" use:enhance>
				<input type="hidden" name="id" value={kind.id} />
			</form>
		</Accordion.Content>
	</Accordion.Item>
{/snippet}
