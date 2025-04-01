<script lang="ts">
	import Logo from '$lib/components/app/logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import { mustache } from '@lucide/lab';
	import { Icon } from 'lucide-svelte';
</script>

<div class="mb-16 mt-16 flex flex-col items-center">
	<Logo />

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
