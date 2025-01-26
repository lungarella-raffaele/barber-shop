<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import Terminal from 'lucide-svelte/icons/terminal';
	import * as Alert from '$lib/components/ui/alert/index.js';

	let { data } = $props();
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-6 mt-4 justify-center text-4xl font-extrabold">Emis Barber Shop</h1>

	<Button href="/newreservation">Prenota Ora</Button>

	<p class="my-3 text-muted-foreground">oppure</p>
	<span>
		<a class="underline" href="Tel: 345 678 91011">Chiama</a>
		al {BARBER_SHOP_DETAILS.phone}
	</span>

	{#if data.success}
		<Alert.Root class="text-green-800">
			<Terminal class="size-4" />
			<Alert.Title>Grazie per la prenotazione!</Alert.Title>
			<Alert.Description
				>Puoi vedere i dettagli della tua prenotazione <a href="/success">qui</a
				>.</Alert.Description
			>
		</Alert.Root>
	{/if}
</div>
