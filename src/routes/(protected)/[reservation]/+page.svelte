<script lang="ts">
	import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatCurrency, formatDate, formatTime } from '$lib/utils';

	const { data }: { data: PageData } = $props();

	const reservation = data.reservation;

	type Reservation = {
		id: string;
		date: string;
		hour: string;
		name: string;
		email: string;
		kindName: string;
		kindDuration: number;
		kindPrice: number;
	};

	const rows = [
		{ accessor: 'date', label: 'Giorno' },
		{ accessor: 'hour', label: 'Ora' },
		{ accessor: 'email', label: 'Email' },
		{ accessor: 'name', label: 'Nome' },
		{ accessor: 'kindName', label: 'Servizio' },
		{ accessor: 'kindDuration', label: 'Durata' },
		{ accessor: 'kindPrice', label: 'Prezzo' }
	];

	const isValidKey = (key: string): key is keyof Reservation => {
		return key in reservation;
	};

	const getValue = (accessor: string) => {
		const value = isValidKey(accessor) ? reservation[accessor] : '';
		if (!value) {
			return '';
		}

		switch (accessor) {
			case 'date': {
				return formatDate(value.toString());
			}
			case 'kindDuration': {
				return `${value} min`;
			}
			case 'hour': {
				return formatTime(value.toString());
			}
			case 'kindPrice': {
				return formatCurrency(value.toString());
			}
		}
		return value;
	};
</script>

<svelte:head>
	<meta
		name="description"
		content="Visualizza i dettagli della tua prenotazione: nome, email, data e servizio selezionato."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>Prenotazione del {formatDate(reservation.date)}</Card.Title>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Body>
				{#each rows as r (r.accessor)}
					<Table.Row>
						<Table.Cell class="font-medium">{r.label}</Table.Cell>
						<Table.Cell>
							{getValue(r.accessor)}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
