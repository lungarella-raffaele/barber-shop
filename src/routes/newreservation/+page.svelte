<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ConfirmReservationDialog from '$lib/components/app/confirmreservationdialog.svelte';
	import DatePicker from '$lib/components/app/datepicker.svelte';
	import ServicePicker from '$lib/components/app/servicepicker.svelte';
	import SlotPicker from '$lib/components/app/slotpicker.svelte';
	import { ChevronLeft, ChevronRight } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
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
			const { user } = data;
			if (user && !user.isAdmin) {
				reservationManager.name = user.name;
				reservationManager.email = user.email;
				reservationManager.phone = user.phoneNumber ?? '';
			}
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
		formData.append('hour', reservationManager.hour);
		formData.append('service', reservationManager.selectedService);
		formData.append('name', reservationManager.name);
		formData.append('email', reservationManager.email);
		formData.append('phone', reservationManager.phone);

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
				if (result.status === 400 && result.data) {
					const step = result.data.step;
					toast.warning(result.data.message);
					reservationManager.goToTab(step);
				} else if (result.status === 500) {
					toast.error('Non è stato possibile effettuare la prenotazione!', {
						description: 'Riprova più tardi',
						duration: 4000
					});
				} else if (result.status === 409) {
					toast.error('Prenotazione non disponibile', {
						description: `Purtroppo la data da te scelta non è più disponibile. Scegli un'altra data`,
						duration: 4000
					});
				}
			}
			isDialogOpen = false;
			loading = false;
		};
	};
	let isDialogOpen = $state(false);
	let loading = $state(false);

	const service = $derived(data.kinds.find((el) => el.id === reservationManager.selectedService));
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

<svelte:head>
	<meta
		name="description"
		content="Prenota subito il tuo appuntamento da Emi Hair Club di Emiliano Lo Russo. Scegli tra i vari servizi, seleziona data e orario disponibili e ricevi conferma istantanea. Prenota online in pochi click."
	/>
</svelte:head>

<h1 class="title">Prenotazione</h1>

<form method="POST" use:enhance={submitReservation} id="reservationForm">
	{#if reservationManager.date && service}
		<ConfirmReservationDialog
			bind:isOpen={isDialogOpen}
			{loading}
			name={reservationManager.name}
			email={reservationManager.email}
			date={reservationManager.date}
			hour={reservationManager.hour}
			service={service.name}
			phone={reservationManager.phone}
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
					<Card.Content>
						<Label>Nome</Label>
						<Input
							name="name"
							bind:value={reservationManager.name}
							placeholder="Inserisci il tuo nome"
							class="mb-4"
							autocomplete="name"
						/>

						<Label>Email</Label>
						<Input
							name="email"
							bind:value={reservationManager.email}
							placeholder="Inserisci la tua email"
							autocomplete="email"
						/>
						<p class="mb-4 ml-2 mt-2 text-sm text-muted-foreground">
							Ti verrà inviata una mail per confermare la prenotazione all'indirizzo
							email indicato indicato.
						</p>

						<Label>Numero di telefono</Label>
						<Input
							name="phone"
							bind:value={reservationManager.phone}
							placeholder="Inserisci il tuo numero di cellulare"
							autocomplete="mobile tel"
						/>
						<p class="mb-4 ml-2 mt-2 text-sm text-muted-foreground">
							Il numero di cellulare è opzionale e verrà utilizzato solo nel momento
							in cui ci saranno comunicazioni urgenti.
						</p>
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
					{#if data.user?.isAdmin}
						<Card.Title class="mb-4">Informazioni</Card.Title>
						<Label>Nome</Label>
						<Input
							type="text"
							name="name"
							bind:value={reservationManager.name}
							placeholder="Inserisci il nome di chi sta prenotando"
						/>
					{/if}
				</Card.Header>
				<Card.Header>
					<Card.Title>Servizio</Card.Title>
					<Card.Description>Scegli il taglio di capelli dai seguenti</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<ServicePicker services={data.kinds} />
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
