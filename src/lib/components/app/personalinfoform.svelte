<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import ReservationManager from '$lib/composables/reservation-manager.svelte';
	import { Label } from '../ui/label';

	const reservationManager = ReservationManager.get();
</script>

<Label>Nome</Label>
<Input name="name" bind:value={reservationManager.name} placeholder="Inserisci il tuo nome" />

<Label>Email</Label>
<Input name="email" bind:value={reservationManager.email} placeholder="Inserisci la tua email" />
