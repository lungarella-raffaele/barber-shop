<script lang="ts">
	import { enhance } from '$app/forms';
	import BookForm from '$lib/components/app/bookform.svelte';
	import Date from '$lib/components/app/date.svelte';
	import ServicePicker from '$lib/components/app/servicepicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let tab = $state('date');

	let date = $state();
	let hour = $state();

	const submitBooking: SubmitFunction = ({ formData }) => {
		const booking = {
			date,
			hour
		};
		formData.append('booking', JSON.stringify(booking));

		return async ({ result }) => {
			if (result.type === 'success') {
				console.log('ok');
			}
		};
	};
</script>

<form method="post" use:enhance={submitBooking} id="booking-form"></form>

<Tabs.Root bind:value={tab}>
	<Tabs.List class="grid w-full grid-cols-3">
		<Tabs.Trigger value="date">Data</Tabs.Trigger>
		<Tabs.Trigger value="service">Service</Tabs.Trigger>
		<Tabs.Trigger value="info">Info</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="date">
		<Card.Root>
			<Card.Header>
				<Card.Title>Data</Card.Title>
				<Card.Description>Seleziona una data per l'appuntamento</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<Date bind:date bind:hour />
			</Card.Content>
			<Card.Footer>
				{@render NextButton('service')}
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="service">
		<Card.Root>
			<Card.Header>
				<Card.Title>Servizio</Card.Title>
				<Card.Description>Scegli il taglio di capelli servizio dai seguenti:</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<ServicePicker />
			</Card.Content>
			<Card.Footer>
				{@render NextButton('info')}
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="info">
		<Card.Root>
			<Card.Header>
				<Card.Title>Informazioni personali</Card.Title>
				<Card.Description>
					Inserisci le informazioni personali obbligatorie per una prenotazione
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<BookForm data={data.form} />
			</Card.Content>
			<Card.Footer>
				<Button type="submit" form="booking-form" class="w-full">Prenota</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>

{#snippet NextButton(target: string)}
	<Button onclick={() => (tab = target)} class="w-full">Continua</Button>
{/snippet}
