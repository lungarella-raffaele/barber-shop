<script lang="ts">
	import { enhance } from '$app/forms';
	import Date from '$lib/components/app/date.svelte';
	import PersonalInfoForm from '$lib/components/app/personalinfoform.svelte';
	import ServicePicker from '$lib/components/app/servicepicker.svelte';
	import { ChevronLeft, ChevronRight, CircleAlert } from '$lib/components/icons/index';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import ReservationDrawer from '$lib/components/app/reservationdrawer.svelte';
	import { getLocalTimeZone } from '@internationalized/date';

	let { data }: { data: PageData } = $props();

	const reservationManager = ReservationManager.istance();

	const submitReservation: SubmitFunction = ({ formData, cancel }) => {
		if (reservationManager.check()) {
			cancel();
		}

		formData.append('date', JSON.stringify(reservationManager.date?.toString()));
		formData.append('hour', reservationManager.hour);
		formData.append('service', reservationManager.service);

		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				if (result.data.bookingCreated) {
					console.log('hooray');
				}
			} else if (result.type === 'failure' && result.data) {
				const step = result.data.step;
				const message = result.data.message;
				reservationManager.message = message;
				reservationManager.goToTab(step);
			}
		};
	};
</script>

<div class="flex justify-between">
	<h1 class="title">Prenotazione</h1>

	<ReservationDrawer services={data.services} />
</div>

{#if reservationManager.message}
	<Alert.Root variant="destructive" class="mb-3">
		<CircleAlert class="size-4" />
		<Alert.Description>{reservationManager.message}</Alert.Description>
	</Alert.Root>
{/if}

<form method="POST" use:enhance={submitReservation}>
	<Tabs.Root bind:value={reservationManager.tab}>
		<Tabs.List class="grid w-full grid-cols-3">
			{#each reservationManager.tabs as tab}
				<Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Tabs.Content value="date">
			<Card.Root>
				<Card.Header>
					<Card.Title>Data</Card.Title>
					<Card.Description>Seleziona una data per l'appuntamento</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<Date />
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					{@render NavStepper()}
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
					<ServicePicker services={data.services} />
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					{@render NavStepper()}
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
					<PersonalInfoForm />
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					{@render NavStepper()}
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</form>

{#snippet NavStepper()}
	<Button
		aria-label="Go to previous step"
		variant="outline"
		class="pr-6"
		disabled={reservationManager.isFirst()}
		onclick={() => reservationManager.back()}><ChevronLeft class="w-4" />Indietro</Button
	>
	{#if !reservationManager.isLast()}
		<Button aria-label="Go to next step" class="pl-6" onclick={() => reservationManager.next()}
			>Avanti <ChevronRight class="w-4" /></Button
		>
	{:else}
		<Button type="submit" aria-label="Submit">Prenota</Button>
	{/if}
{/snippet}
