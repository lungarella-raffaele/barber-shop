<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-6 mt-4 justify-center text-4xl font-extrabold">Emis Barber Shop</h1>

	<Button href="/newreservation">Prenota Ora</Button>

	<p class="my-3 text-muted-foreground">oppure</p>
	<span>
		<a class="underline" href="Tel: 345 678 91011">Chiama</a>
		al {BARBER_SHOP_DETAILS.phone}
	</span>
</div>
