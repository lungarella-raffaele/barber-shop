<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import Ticket from './ticket.svelte';
	import { PanelBottomOpen } from 'lucide-svelte';
	import type { Service } from '$lib/models/service.model';
	import { buttonVariants } from '$lib/components/ui/button/index';

	let { services }: { services: Service[] } = $props();

	const reservationManager = ReservationManager.istance();
</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: 'icon' })}>
		<PanelBottomOpen />
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Dettagli prenotazione</Drawer.Title>
				<Drawer.Description>Controlla tutti i dettagli della tua prenotazione</Drawer.Description>
			</Drawer.Header>

			<Ticket
				service={services.find((el) => el.id === reservationManager.service)?.name}
				hour={reservationManager.hour}
				date={reservationManager.date}
				name={reservationManager.name}
				surname={reservationManager.surname}
			/>
			<Drawer.Footer></Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
