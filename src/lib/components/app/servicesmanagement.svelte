<script lang="ts">
	import EditButton from '$lib/components/app/editbutton.svelte';
	import { Check, CirclePlus, Save, Trash, X } from '$lib/components/icons/index';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Service } from '$lib/models/types';
	import { slide } from 'svelte/transition';

	let { services }: { services: Service[] } = $props();

	const serviceBackup = services;

	let isEditing = $state(false);
	let whoIsOpen = $state('');

	const handleEditToggle = () => {
		services = serviceBackup.map((s) => ({ ...s }));
	};

	let isAddingService = $state(false);
	const toggleAddService = () => {
		isAddingService = !isAddingService;
	};
</script>

<h2 class="my-4 text-2xl font-bold">Servizi</h2>
<Accordion.Root type="single" bind:value={whoIsOpen} class="mb-8">
	{#each services as service}
		{@render serviceItem(service)}
	{/each}
</Accordion.Root>

{#if !isAddingService}
	<Button class="w-full" variant="secondary" onclick={toggleAddService}
		><CirclePlus />Aggiungi servizio</Button
	>
{/if}
{#if isAddingService}
	<div transition:slide class="rounded-md border shadow">
		<div class="flex flex-col p-4">
			<h2 class="mb-4 p-2 text-lg font-bold">Aggiungi servizio</h2>
			<form action="?/addService" id="adding-service-form" method="post">
				<Label for="new-service-name">Nome</Label>
				<Input
					id="new-service-name"
					type="text"
					placeholder="Nome"
					name="name"
					class="mb-4"
				/>

				<Label for="new-service-description">Descrizione</Label>
				<Textarea
					id="new-service-description"
					placeholder="Descrizione del servizio"
					name="description"
					class="mb-4"
				/>

				<Label for="new-service-duration">Durata</Label>
				<Input
					id="new-service-duration"
					placeholder="Durata del servizio"
					name="duration"
					class="mb-4"
					type="number"
				/>

				<Label for="new-service-price">Prezzo</Label>
				<Input
					id="new-service-price"
					placeholder="Prezzo del servizio"
					type="number"
					name="price"
					class="mb-4"
				/>

				<div class="mt-4 flex items-center">
					<Switch id="new-service-active" name="active" />
					<Label class="mb-0" for="new-service-active">Disponibilità</Label>
				</div>

				<div class="mt-8 flex w-full flex-row-reverse gap-2">
					<Button type="submit">
						<Save />
						Salva
					</Button>

					<Button type="button" variant="secondary" onclick={toggleAddService}>
						Annulla
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#snippet serviceItem(service: Service)}
	<Accordion.Item value={service.id} disabled={isEditing}>
		<Accordion.Trigger>
			<h1 class="flex items-center">
				<span class="mr-2">
					{service.name}
				</span>

				{#if service.active}
					<Check size={17} color="green" />
				{:else}
					<X color="red" size={17} />
				{/if}
			</h1>
		</Accordion.Trigger>
		<Accordion.Content class="rounded-lg py-4">
			<form action="?/updateService" id={service.id + '-form'} method="post">
				<input type="hidden" value={service.id} name="id" />
				<Label for={service.id + '-name'}>Nome</Label>
				<Input
					disabled={!isEditing}
					id={service.id + '-name'}
					value={service.name}
					type="text"
					placeholder="Nome"
					name="name"
					class="mb-4"
				/>

				<Label for={service.id + '-description'}>Descrizione</Label>
				<Textarea
					disabled={!isEditing}
					id={service.id + '-description'}
					value={service.description}
					placeholder="Descrizione del servizio"
					name="description"
					class="mb-4"
				/>

				<Label for={service.id + '-duration'}>Durata</Label>
				<Input
					id={service.id + '-duration'}
					disabled={!isEditing}
					value={service.duration}
					placeholder="Durata del servizio"
					name="duration"
					class="mb-4"
				/>

				<Label for={service.id + '-price'}>Prezzo</Label>
				<Input
					disabled={!isEditing}
					id={service.id + '-price'}
					value={service.price}
					placeholder="Prezzo del servizio"
					type="number"
					name="price"
					class="mb-4"
				/>

				<div class="mt-4 flex items-center space-x-2">
					<Switch
						id={service.id + '-active'}
						checked={service.active}
						disabled={!isEditing}
						name="active"
					/>

					<Label class="mb-0" for={service.id + '-active'}>Disponibilità</Label>
				</div>

				<div class="mt-8 flex justify-between">
					<div class="flex gap-2">
						<Button
							variant="destructive"
							type="submit"
							form="{service.id}-delete-service"
						>
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

			<form action="?/deleteService" method="post" id="{service.id}-delete-service">
				<input type="hidden" name="id" value={service.id} />
			</form>
		</Accordion.Content>
	</Accordion.Item>
{/snippet}
