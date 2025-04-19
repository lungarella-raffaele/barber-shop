<script lang="ts">
	import EditButton from '$lib/components/app/editbutton.svelte';
	import { Check, Save, X } from '$lib/components/icons/index';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';

	let { services } = $props();

	const serviceBackup = services;

	let isEditing = $state(false);
	let whoIsOpen = $state('');

	const handleEditToggle = () => {
		services = serviceBackup.map((s) => ({ ...s }));
	};
</script>

<h2 class="my-4 text-2xl font-bold">Servizi</h2>
<Accordion.Root type="single" bind:value={whoIsOpen}>
	{#each services as service}
		{@render serviceItem(service)}
	{/each}
</Accordion.Root>

{#snippet serviceItem(service)}
	<Accordion.Item value={service.id} disabled={isEditing}>
		<Accordion.Trigger>
			<h1 class="flex items-center">
				<span class="mr-2">
					{service.name}
				</span>

				{#if service.inactive}
					<Check size={17} color="green" />
				{:else}
					<X color="red" size={17} />
				{/if}
			</h1>
		</Accordion.Trigger>
		<Accordion.Content class="rounded-lg bg-card p-4">
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
				/>

				<Label for={service.id + '-description'}>Descrizione</Label>
				<Textarea
					disabled={!isEditing}
					id={service.id + '-description'}
					value={service.description}
					placeholder="Descrizione del servizio"
					name="description"
				/>

				<Label for={service.id + '-duration'}>Durata</Label>
				<Input
					id={service.id + '-duration'}
					disabled={!isEditing}
					value={service.duration}
					placeholder="Durata del servizio"
					name="duration"
				/>

				<Label for={service.id + '-price'}>Prezzo</Label>
				<Input
					disabled={!isEditing}
					id={service.id + '-price'}
					value={service.price}
					placeholder="Prezzo del servizio"
					type="number"
					name="price"
				/>

				<div class="mt-4 flex items-center space-x-2">
					<Switch
						id={service.id + '-inactive'}
						checked={service.inactive}
						disabled={!isEditing}
						name="inactive"
					/>

					<Label for={service.id + '-inactive'}>Disponibilità</Label>
				</div>

				<div class="mt-8 flex flex-row-reverse gap-2">
					<EditButton bind:pressed={isEditing} onclick={handleEditToggle} />

					{#if isEditing}
						<Button variant="outline" type="submit">
							<Save />
							Salva
						</Button>
					{/if}
				</div>
			</form>
		</Accordion.Content>
	</Accordion.Item>
{/snippet}
