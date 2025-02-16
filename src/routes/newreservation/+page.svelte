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
	import Personalinfoform from '$lib/components/app/personalinfoform.svelte';

	const { data }: { data: PageData } = $props();
	const reservationManager = ReservationManager.instance(
		data.services,
		data.currentReservations,
		!!data.user
	);

	const handleConfirmReservation = () => {
		if (!reservationManager.check()) {
			isDialogOpen = true;
		}
	};

	const submitReservation: SubmitFunction = ({ formData, cancel }) => {
		loading = true;
		if (reservationManager.check()) {
			return cancel();
		}

		if (!reservationManager.date) {
			return cancel();
		}

		formData.append('date', reservationManager.date.toString());
		formData.append('hour', reservationManager.slot);
		formData.append('service', reservationManager.service?.id ?? '');
		formData.append('name', reservationManager.name);
		formData.append('email', reservationManager.email);

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Prenotazione confermata!', {
					duration: 7000
				});
				goto('/');
			} else if (result.type === 'failure') {
				console.log('okay');
				if (result.status === 404 && result.data) {
					const step = result.data.step;
					toast.warning(result.data.message);
					reservationManager.goToTab(step);
				} else if (result.status === 500) {
					toast.error('Non è stato possibile effettuare la prenotazione!', {
						description: 'Riprova più tardi',
						duration: 2000
					});
				}
			}
			isDialogOpen = false;
			loading = false;
		};
	};
	let isDialogOpen = $state(false);
	let loading = $state(false);

	const name = $derived(data.user?.name ?? reservationManager.name);
	const email = $derived(data.user?.email ?? reservationManager.email);
</script>

<h1 class="title">Prenotazione</h1>

<form method="POST" use:enhance={submitReservation} id="reservationForm">
	<Tabs.Root bind:value={reservationManager.currentTab}>
		<Tabs.List class="flex">
			{#if !data.user}
				<Tabs.Trigger class="flex-1" value="info">Nominativo</Tabs.Trigger>
			{/if}
			<Tabs.Trigger class="flex-1" value="service">Servizio</Tabs.Trigger>
			<Tabs.Trigger class="flex-1" disabled={!reservationManager.service} value="date"
				>Data</Tabs.Trigger
			>
		</Tabs.List>

		{#if !data.user}
			<Tabs.Content value="info">
				<Card.Root>
					<Card.Header>
						<Card.Title>Nominativo</Card.Title>
						<Card.Description>Inserisci le tue informazioni personali</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<Personalinfoform />
					</Card.Content>
					<Card.Footer class="mt-8 items-center justify-between">
						<Button
							aria-label="Go to previous step"
							variant="ghost"
							class="pr-6"
							disabled={reservationManager.isFirst()}
							onclick={() => reservationManager.back()}
							><ChevronLeft class="w-4" />Indietro</Button
						>
						<Button
							aria-label="Go to next step"
							class="pl-6"
							onclick={() => reservationManager.next()}
							>Avanti <ChevronRight class="w-4" /></Button
						>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		{/if}
		<Tabs.Content value="service">
			<Card.Root>
				<Card.Header>
					<Card.Title>Servizio</Card.Title>
					<Card.Description>Scegli il taglio di capelli dai seguenti</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<ServicePicker services={data.services} />
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					<Button
						aria-label="Go to previous step"
						variant="ghost"
						class="pr-6"
						disabled={reservationManager.isFirst()}
						onclick={() => reservationManager.back()}
						><ChevronLeft class="w-4" />Indietro</Button
					>
					<Button
						aria-label="Go to next step"
						disabled={!reservationManager.service}
						class="pl-6"
						onclick={() => reservationManager.next()}
						>Avanti <ChevronRight class="w-4" /></Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="date">
			<Card.Root>
				<Card.Header>
					<Card.Title>Data</Card.Title>
					<Card.Description>Scegli la data della prenotazione</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<Date />
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					<Button
						aria-label="Go to previous step"
						variant="ghost"
						class="pr-6"
						disabled={reservationManager.isFirst()}
						onclick={() => reservationManager.back()}
						><ChevronLeft class="w-4" />Indietro</Button
					>
					<Button type="button" onclick={handleConfirmReservation} aria-label="Submit"
						>Prenota</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>

	<ConfirmReservationDialog bind:isOpen={isDialogOpen} {loading} {name} {email} />
</form>
