<script lang="ts">
	import { LoaderCircle } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { formatTime } from '$lib/utils';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';

	let {
		isOpen = $bindable(),
		loading,
		name,
		email,
		hour,
		date,
		service,
		phone
	}: {
		isOpen: boolean;
		loading: boolean;
		name: string;
		email: string;
		hour: string;
		date: DateValue;
		service: string;
		phone?: string;
	} = $props();

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
		<Dialog.Header>
			<Dialog.Title class="text-left">Conferma prenotazione</Dialog.Title>
			<Dialog.Description class="text-left">
				La prenotazione verrà salvata con le seguenti informazioni.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid grid-cols-4 grid-rows-4 items-center gap-4 p-6">
			<Label class="mb-0 text-right text-muted-foreground">Nome</Label>
			<span class="col-span-3">
				{name}
			</span>

			<Label class="mb-0 text-right text-muted-foreground">Email</Label>
			<span class="col-span-3">
				{email}
			</span>

			<Label class="mb-0 text-right text-muted-foreground">Data</Label>
			<span class="col-span-3">
				{date ? df.format(date.toDate(getLocalTimeZone())) : ''} alle
				{formatTime(hour)}
			</span>

			<Label class="mb-0 text-right text-muted-foreground">Servizio</Label>
			<span class="col-span-3">
				{service}
			</span>

			<Label class="mb-0 text-right text-muted-foreground">Numero di telefono</Label>
			<span class="col-span-3">
				{#if phone}
					{phone}
				{:else}
					Non specificato
				{/if}
			</span>
		</div>
		<Dialog.Footer>
			<Button type="button" variant="ghost">Chiudi</Button>
			<Button disabled={loading} type="submit" form="reservationForm">Conferma</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
