<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import { mustache } from '@lucide/lab';
	import { Icon } from 'lucide-svelte';
</script>

<div class="mb-16 mt-16 flex flex-col items-center">
	<div class="mb-12">
		<h1 class="emi">
			EMI
			<div class="bg-foreground underline"></div>
		</h1>
		<h4 class="hair-club">HAIR CLUB</h4>
	</div>

	<Button href="/newreservation">
		<Icon iconNode={mustache} />
		Prenota
	</Button>

	<p class="my-3 text-muted-foreground">oppure</p>
	<span>
		<a class="underline" href="Tel: {BARBER_SHOP_DETAILS}">Chiama</a>
		al {BARBER_SHOP_DETAILS.phone}
	</span>
</div>

<style>
	.emi {
		font-family: 'Overpass', sans-serif;
		font-weight: normal;
		font-size: 9rem;
		line-height: 1;
	}
	.hair-club {
		font-family: 'Overpass', sans-serif;
		font-weight: normal;
		font-size: 3rem;
		margin-top: 20px;
		/* font-optical-sizing: auto;
		font-style: normal; */
	}
	.underline {
		height: 0.2rem;
		width: 100%;
	}
</style>
