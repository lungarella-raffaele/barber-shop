<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ConfirmDialog from './components/confirm.svelte';
	import DatePicker from './components/datepicker.svelte';
	import KindPicker from './components/kindpicker.svelte';
	import SlotPicker from './components/slotpicker.svelte';
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
	import StaffPicker from './components/staffpicker.svelte';
	import type { DBReservation, DBKind, Staff } from '@types';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { mapToUI } from '../(protected)/(admin)/dashboard/calendar/ranges';

	const { data }: { data: PageData } = $props();

	const rm = ReservationManager.instance(data.user?.role);
	const schedule = $derived(mapToUI(data.schedule ?? [], rm.data.staff));

	const submitReservation: SubmitFunction = ({ formData }) => {
		loading = true;
		formData.append('data', JSON.stringify(rm.data));

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
				if (result.status === 404) {
					toast.warning('Controlla i dati inseriti');
				} else if (result.status === 500) {
					if (result.data?.email) {
						toast.error("Non è stato possibile inviare l'email.", {
							description: 'Riprova più tardi',
							duration: 4000
						});
					} else {
						toast.error('Impossibile effettuare la prenotazione.', {
							description: 'Riprova più tardi',
							duration: 4000
						});
					}
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

	let kinds: DBKind[] = [];

	onMount(async () => {
		kinds = (await data.kinds) ?? [];
	});
	const kind = $derived(kinds.find((el) => el.id === rm.data.kind));

	const availableSlots = $derived.by(() => {
		if (!rm.data.date || !rm.data.staff) {
			return [];
		}
		return getSlots(
			parseDate(rm.data.date),
			data.currentReservations
				.filter((entry) => entry.staff.id === rm.data.staff) // Chosen staff member
				.filter((el) => el.date === rm.data.date) // Chosen date
				.map((entry) => ({
					date: parseDate(entry.date),
					start: parseTime(entry.hour),
					duration: minutesToTime(entry.kind.duration)
				})),
			schedule,
			kind?.duration ? minutesToTime(kind.duration) : undefined
		);
	});

	const book = () => {
		const correctData = rm.check();

		if (correctData) {
			isDialogOpen = true;
		}
	};
</script>

<svelte:head>
	<meta
		name="description"
		content="Prenota subito il tuo appuntamento da Emi Hair Club di Emiliano Lo Russo. Scegli tra i vari servizi, seleziona data e orario disponibili e ricevi conferma istantanea. Prenota online in pochi click."
	/>
</svelte:head>

<h1 class="title">Prenotazione</h1>

{#await Promise.all([data.staff, data.kinds]) then [staff, kinds]}
	<form method="POST" use:enhance={submitReservation} id="reservationForm">
		<ConfirmDialog
			bind:isOpen={isDialogOpen}
			{loading}
			staff={staff ?? []}
			kinds={kinds ?? []}
			data={rm.data}
		/>
	</form>
{/await}

<Tabs.Root bind:value={rm.currentTab}>
	<Tabs.List class="flex">
		{#if !data.user}
			<Tabs.Trigger class="flex-1" value="info">Dati personali</Tabs.Trigger>
		{/if}
		<Tabs.Trigger class="flex-1" value="kind">Servizio</Tabs.Trigger>
		<Tabs.Trigger class="flex-1" disabled={!rm.data.kind} value="date">Data</Tabs.Trigger>
	</Tabs.List>

	{#if !data.user}
		<Tabs.Content value="info">
			<Card.Root>
				<Card.Header>
					<Card.Title>Dati personali</Card.Title>
					<Card.Description>Inserisci i tuoi dati personali</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if rm.data.who === 'anonymous'}
						<div class="mb-8">
							<Label>Nome*</Label>
							<Input
								name="name"
								bind:value={rm.data.name}
								placeholder="Mario Rossi"
								autocomplete="name"
								required
							/>
						</div>

						<Label>Email*</Label>
						<Input
							name="email"
							bind:value={rm.data.email}
							placeholder="mariorossi@esempio.com"
							autocomplete="email"
							required
						/>
						<p class="mb-8 ml-2 mt-2 text-sm text-muted-foreground">
							Riceverai una mail di conferma all'indirizzo email indicato.
						</p>

						<Label>Numero di telefono</Label>
						<Input
							name="phone"
							bind:value={rm.data.phone}
							placeholder="+39 333 444 55 66"
							autocomplete="mobile tel"
						/>
						<p class="mb-8 ml-2 mt-2 text-sm text-muted-foreground">
							Numero di cellulare opzionale, usato solo per comunicazioni urgenti.
						</p>
					{/if}
				</Card.Content>
				<Card.Footer class="mt-8 items-center justify-end">
					<Button
						aria-label="Go to next step"
						class="pl-6"
						onclick={() => (rm.currentTab = 'kind')}
					>
						Avanti <ChevronRight class="w-4" />
					</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	{/if}
	<Tabs.Content value="kind">
		<Card.Root>
			<Card.Header>
				{#if rm.data.who === 'staff'}
					<div class="mb-4">
						<Card.Title class="mb-4">Informazioni</Card.Title>
						<Input
							type="text"
							name="alternativeName"
							bind:value={rm.data.name}
							placeholder="Mario Rossi"
						/>
					</div>
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
				{#await data.kinds}
					<div class="flex flex-col gap-4">
						{#each { length: 6 }}
							<Skeleton class="h-[82px] w-full" />
						{/each}
					</div>
				{:then data}
					<KindPicker
						kinds={data?.filter((el) => el.staffID === rm.data.staff) ?? []}
						bind:value={rm.data.kind}
					/>
				{/await}
			</Card.Content>
			<Card.Footer class="mt-8 items-center justify-between">
				<Button
					aria-label="Go to previous step"
					variant="ghost"
					class="pr-6"
					disabled={rm.data.who !== 'anonymous'}
					onclick={() => (rm.currentTab = 'info')}
					><ChevronLeft class="w-4" />Indietro</Button
				>
				<Button
					aria-label="Go to next step"
					disabled={!rm.data.kind}
					class="pl-6"
					onclick={() => (rm.currentTab = 'date')}
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
				<DatePicker bind:value={rm.data.date} shutdown={data.shutdown} />
				<SlotPicker {availableSlots} date={rm.data.date} bind:value={rm.data.hour} />
			</Card.Content>
			<Card.Footer class="mt-8 items-center justify-between">
				<Button
					aria-label="Go to previous step"
					variant="ghost"
					class="pr-6"
					onclick={() => (rm.currentTab = 'kind')}
					><ChevronLeft class="w-4" />Indietro</Button
				>
				<Button type="button" onclick={book} aria-label="Submit">Prenota</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
