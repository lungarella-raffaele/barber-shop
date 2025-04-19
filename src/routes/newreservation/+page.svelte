<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ConfirmReservationDialog from '$lib/components/app/confirmreservationdialog.svelte';
	import DatePicker from '$lib/components/app/datepicker.svelte';
	import Personalinfoform from '$lib/components/app/personalinfoform.svelte';
	import ServicePicker from '$lib/components/app/servicepicker.svelte';
	import SlotPicker from '$lib/components/app/slotpicker.svelte';
	import { ChevronLeft, ChevronRight } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { getSlots } from '$lib/get-slots';
	import { minutesToTime } from '$lib/utils';
	import { parseDate, parseTime } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const reservationManager = ReservationManager.instance(!!data.user);

	const confirmReservation = () => {
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
			console.warn('Date not specified');
			return cancel();
		}
		if (!reservationManager.selectedService) {
			console.warn('Service not specified');
			return cancel();
		}

		formData.append('date', reservationManager.date.toString());
		formData.append('hour', reservationManager.slot);
		formData.append('service', reservationManager.selectedService);
		formData.append('name', reservationManager.name);
		formData.append('email', reservationManager.email);

		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				if (result.data.newReservation && result.data.pending) {
					goto(`/?pending=${result.data.newReservation.id}`);
				} else if (result.data.newReservation) {
					toast.success('Prenotazione confermata!', {
						duration: 7000
					});
					goto('/');
				}
			} else if (result.type === 'failure') {
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
	const service = $derived(
		data.services.find((el) => el.id === reservationManager.selectedService)
	);
	const availableSlots = $derived.by(() => {
		if (!reservationManager.date) {
			return [];
		}
		return getSlots(
			reservationManager.date,
			data.currentReservations
				.filter((el) => el.date === reservationManager.date?.toString())
				.map((el) => ({
					date: parseDate(el.date),
					start: parseTime(el.startingTime),
					duration: minutesToTime(el.duration)
				})),
			service?.duration ? minutesToTime(service.duration) : undefined
		);
	});
</script>

<h1 class="title">Prenotazione</h1>

<form method="POST" use:enhance={submitReservation} id="reservationForm">
	{#if reservationManager.date && service}
		<ConfirmReservationDialog
			bind:isOpen={isDialogOpen}
			{loading}
			{name}
			{email}
			date={reservationManager.date}
			hour={reservationManager.slot}
			service={service.name}
		/>
	{/if}
	<Tabs.Root bind:value={reservationManager.currentTab}>
		<Tabs.List class="flex">
			{#if !data.user}
				<Tabs.Trigger class="flex-1" value="info">Nominativo</Tabs.Trigger>
			{/if}
			<Tabs.Trigger class="flex-1" value="service">Servizio</Tabs.Trigger>
			<Tabs.Trigger
				class="flex-1"
				disabled={!reservationManager.selectedService}
				value="date"
			>
				Data
			</Tabs.Trigger>
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
						>
							Avanti <ChevronRight class="w-4" />
						</Button>
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
						disabled={!reservationManager.selectedService}
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
					<DatePicker bind:value={reservationManager.date} closures={data.closures} />

					<SlotPicker {availableSlots} />
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
					<Button type="button" onclick={confirmReservation} aria-label="Submit"
						>Prenota</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</form>
