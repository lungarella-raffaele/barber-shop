<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { LoaderCircle } from '$lib/components/icons/index';

	let { isOpen = $bindable(), loading } = $props();

	const reservationManager = ReservationManager.istance();

	const df = new DateFormatter('it-IT', {
		dateStyle: 'long'
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if loading}
			<div
				class="absolute bottom-0 left-0 right-0 top-0 rounded-lg bg-background bg-opacity-60"
			></div>

			<LoaderCircle size={40} strokeWidth={3} class="absolute inset-0 m-auto animate-spin" />
		{/if}
		<!-- {#if success}
			<Dialog.Header>
				<Dialog.Title class="flex items-center text-left"
					>Prenotazione avvenuta con successo
					<BadgeCheck class="ml-2 text-green-600" />
				</Dialog.Title>
				<Dialog.Description class="text-left"
					>Vai <a href="/profile/reservations">alle tue prenotazioni </a> per visualizzarla</Dialog.Description
				>
			</Dialog.Header>
			<Dialog.Footer>
				<Button type="button" onclick={() => (isOpen = false)}>Chiudi</Button>
			</Dialog.Footer>
		{:else} -->
		<Dialog.Header>
			<Dialog.Title class="text-left">Conferma prenotazione</Dialog.Title>
			<Dialog.Description class="text-left">
				La prenotazione verrà salvata con le seguenti informazioni.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid grid-cols-4 grid-rows-4 items-center gap-4 p-6">
			<Label for="name" class="text-right text-muted-foreground">Nome</Label>
			<span class="col-span-3">
				{reservationManager.name}
			</span>
			<Label for="name" class="text-right text-muted-foreground">Cognome</Label>
			<span class="col-span-3">
				{reservationManager.surname}
			</span>
			<Label for="name" class="text-right text-muted-foreground">Data</Label>
			<span class="col-span-3">
				{reservationManager.date
					? df.format(reservationManager.date.toDate(getLocalTimeZone()))
					: ''} alle
				{reservationManager.hour}
			</span>

			<Label for="name" class="text-right text-muted-foreground">Email</Label>
			<span class="col-span-3">
				{reservationManager.email}
			</span>
		</div>
		<Dialog.Footer>
			<Button type="button" variant="ghost">Chiudi</Button>
			<Button disabled={loading} type="submit" form="reservationForm">Conferma</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
