<script lang="ts">
	import { enhance } from '$app/forms';
	import Date from '$lib/components/app/date.svelte';
	import ServicePicker from '$lib/components/app/servicepicker.svelte';
	import { ChevronLeft, ChevronRight } from '$lib/components/icons/index';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import ConfirmReservationDialog from '$lib/components/app/confirmreservationdialog.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();
	const reservationManager = ReservationManager.istance(data.services);

	const handleConfirmReservation = () => {
		if (!reservationManager.check()) {
			isDialogOpen = true;
		}
	};

	const submitReservation: SubmitFunction = ({ formData, cancel }) => {
		loading = true;
		if (reservationManager.check()) {
			cancel();
		}

		formData.append('date', JSON.stringify(reservationManager.date?.toString()));
		formData.append('hour', reservationManager.hour);
		formData.append('service', reservationManager.service?.id ?? '');

		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				if (result.data.success) {
					toast.success('Prenotazione confermata!', {
						duration: 7000
					});
					goto('/');
				}
			} else if (result.type === 'failure' && result.data) {
				const step = result.data.step;
				toast.error(result.data.message);
				reservationManager.goToTab(step);
			}
			isDialogOpen = false;
			loading = false;
		};
	};
	let isDialogOpen = $state(false);
	let loading = $state(false);
</script>

<div class="flex justify-between">
	<h1 class="title">Prenotazione</h1>
</div>

<form method="POST" use:enhance={submitReservation} id="reservationForm">
	<Tabs.Root bind:value={reservationManager.tab}>
		<Tabs.List class="grid w-full grid-cols-2">
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

		<!-- <Tabs.Content value="info">
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
		</Tabs.Content> -->
	</Tabs.Root>

	<ConfirmReservationDialog bind:isOpen={isDialogOpen} {loading} user={data.user} />
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
		<Button type="button" onclick={handleConfirmReservation} aria-label="Submit">Prenota</Button>
	{/if}
{/snippet}
