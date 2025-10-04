<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ConfirmReservationDialog from '$lib/components/app/confirmreservationdialog.svelte';
	import DatePicker from '$lib/components/app/datepicker.svelte';
	import KindPicker from '$lib/components/app/KindPicker.svelte';
	import SlotPicker from '$lib/components/app/SlotPicker.svelte';
	import { ChevronLeft, ChevronRight } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { getSlots } from '$lib/modules/get-slots';
	import { minutesToTime } from '$lib/utils';
	import { parseDate, parseTime } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import StaffPicker from './components/StaffPicker.svelte';
	import type { DBReservation } from '@types';

	const { data }: { data: PageData } = $props();
	const rm = ReservationManager.instance(!!data.user);
	const kinds = $derived(data.kinds.filter((el) => el.staffID === rm.data.staff));

	const confirmReservation = () => {
		if (rm.check()) {
			const { user } = data;
			if (user && user.role !== 'staff') {
				rm.data.name = user.data.name;
				rm.data.email = user.data.email;
				rm.data.phone = user.data.phoneNumber ?? '';
			}
			isDialogOpen = true;
		}
	};

	const submitReservation: SubmitFunction = ({ formData, cancel }) => {
		loading = true;

		const issues = rm.check();
		if (!issues) {
			return cancel();
		}

		if (!rm.data.date) {
			console.warn('Date not specified');
			return cancel();
		}
		if (!rm.data.kind) {
			console.warn('Kind not specified');
			return cancel();
		}

		formData.append('date', rm.data.date.toString());
		formData.append('hour', rm.data.hour);
		formData.append('kind', rm.data.kind);
		formData.append('name', rm.data.name);
		formData.append('email', rm.data.email);
		formData.append('phone', rm.data.phone);
		formData.append('staff', rm.data.staff);

		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const res = result.data as DBReservation;
				if (res && res.pending) {
					goto(`/?pending=${res.id}`);
				} else if (res) {
					toast.success('Prenotazione confermata!', {
						duration: 7000
					});
					goto('/');
				}
			} else if (result.type === 'failure') {
				if (result.status === 404 && result.data) {
					// const step = result.data.step;
					toast.warning('Controlla i dati inseriti');
					// reservationManager.goToTab(step);
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

	const kind = $derived(data.kinds.find((el) => el.id === rm.data.kind));
	const availableSlots = $derived.by(() => {
		if (!rm.data.date) {
			return [];
		}
		return getSlots(
			rm.data.date,
			data.currentReservations
				.map((entry) => ({
					date: entry.date,
					startingTime: entry.hour,
					duration: entry.kind.duration
				}))
				.filter((el) => el.date === rm.data.date?.toString())
				.map((el) => ({
					date: parseDate(el.date),
					start: parseTime(el.startingTime),
					duration: minutesToTime(el.duration)
				})),
			kind?.duration ? minutesToTime(kind.duration) : undefined
		);
	});
</script>

<button onclick={() => rm.check()}>Controlla</button>

<svelte:head>
	<meta
		name="description"
		content="Prenota subito il tuo appuntamento da Emi Hair Club di Emiliano Lo Russo. Scegli tra i vari servizi, seleziona data e orario disponibili e ricevi conferma istantanea. Prenota online in pochi click."
	/>
</svelte:head>

<h1 class="title">Prenotazione</h1>

<form method="POST" use:enhance={submitReservation} id="reservationForm">
	<ConfirmReservationDialog
		bind:isOpen={isDialogOpen}
		{loading}
		staffs={data.staff}
		kinds={data.kinds}
		data={rm.data}
	/>
</form>

<Tabs.Root bind:value={rm.currentTab}>
	<Tabs.List class="flex">
		{#if !data.user}
			<Tabs.Trigger class="flex-1" value="info">Nominativo</Tabs.Trigger>
		{/if}
		<Tabs.Trigger class="flex-1" value="kind">Servizio</Tabs.Trigger>
		<Tabs.Trigger class="flex-1" disabled={!rm.data.kind} value="date">Data</Tabs.Trigger>
	</Tabs.List>

	{#if !data.user}
		<Tabs.Content value="info">
			<Card.Root>
				<Card.Header>
					<Card.Title>Nominativo</Card.Title>
					<Card.Description>Inserisci le tue informazioni personali</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="mb-4">
						<Label>Nome</Label>
						<Input
							name="name"
							bind:value={rm.data.name}
							placeholder="Inserisci il tuo nome"
							autocomplete="name"
						/>
					</div>

					<Label>Email</Label>
					<Input
						name="email"
						bind:value={rm.data.email}
						placeholder="Inserisci la tua email"
						autocomplete="email"
					/>
					<p class="mb-4 ml-2 mt-2 text-sm text-muted-foreground">
						Ti verrà inviata una mail per confermare la prenotazione all'indirizzo email
						indicato indicato.
					</p>

					<Label>Numero di telefono</Label>
					<Input
						name="phone"
						bind:value={rm.data.phone}
						placeholder="Inserisci il tuo numero di cellulare"
						autocomplete="mobile tel"
					/>
					<p class="mb-4 ml-2 mt-2 text-sm text-muted-foreground">
						Il numero di cellulare è opzionale e verrà utilizzato solo nel momento in
						cui ci saranno comunicazioni urgenti.
					</p>
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-between">
					<Button
						aria-label="Go to previous step"
						variant="ghost"
						class="pr-6"
						disabled={rm.isFirst()}
						onclick={() => rm.back()}><ChevronLeft class="w-4" />Indietro</Button
					>
					<Button aria-label="Go to next step" class="pl-6" onclick={() => rm.next()}>
						Avanti <ChevronRight class="w-4" />
					</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	{/if}
	<Tabs.Content value="kind">
		<Card.Root>
			<Card.Header>
				{#if data.user?.role === 'staff'}
					<Card.Title class="mb-4">Informazioni</Card.Title>
					<Label>Nome</Label>
					<Input
						type="text"
						name="name"
						bind:value={rm.data.name}
						placeholder="Inserisci il nome di chi sta prenotando"
					/>
				{/if}
			</Card.Header>
			<Card.Header class="pt-0">
				<Card.Title class="mt-0">Staff</Card.Title>
				<Card.Description>Chi dovrà servirti?</Card.Description>
				<StaffPicker bind:value={rm.data.staff} staff={data.staff} />
			</Card.Header>
			<Card.Header>
				<Card.Title>Servizio</Card.Title>
				<Card.Description>Scegli il taglio di capelli dai seguenti</Card.Description>
			</Card.Header>
			<Card.Content class="pt-3">
				<KindPicker {kinds} bind:value={rm.data.kind} />
			</Card.Content>
			<Card.Footer class="mt-8 items-center justify-between">
				<Button
					aria-label="Go to previous step"
					variant="ghost"
					class="pr-6"
					disabled={rm.isFirst()}
					onclick={() => rm.back()}><ChevronLeft class="w-4" />Indietro</Button
				>
				<Button
					aria-label="Go to next step"
					disabled={!rm.data.kind}
					class="pl-6"
					onclick={() => rm.next()}>Avanti <ChevronRight class="w-4" /></Button
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
				<DatePicker bind:value={rm.data.date} closures={data.closures} />
				<SlotPicker {availableSlots} date={rm.data.date} bind:value={rm.data.hour} />
			</Card.Content>
			<Card.Footer class="mt-8 items-center justify-between">
				<Button
					aria-label="Go to previous step"
					variant="ghost"
					class="pr-6"
					disabled={rm.isFirst()}
					onclick={() => rm.back()}><ChevronLeft class="w-4" />Indietro</Button
				>
				<Button type="button" onclick={confirmReservation} aria-label="Submit"
					>Prenota</Button
				>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
