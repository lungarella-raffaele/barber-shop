<script>
	import { Button } from '$lib/components/ui/button/index';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
</script>

<div
	class="mt-8 flex flex-col lg:flex-row-reverse [&_*]:text-xs [&_*]:font-light [&_*]:text-muted-foreground"
>
	<div class="flex justify-center">
		{#if BARBER_SHOP_DETAILS.phone}
			<Button class="py-1" variant="link" href="Tel: 345 678 91011">
				{BARBER_SHOP_DETAILS.phone}
			</Button>
		{/if}
	</div>
	<div class="flex justify-center">
		<Button class="py-1" variant="link" target="_blank" href={BARBER_SHOP_DETAILS.google_page}>
			{BARBER_SHOP_DETAILS.street}
		</Button>
	</div>
	<div class="mb-2 flex justify-center">
		<Button class="py-1" variant="link" href="/cookies">Cookies Policy</Button>
		<Button class="py-1" variant="link" href="/privacy">Privacy Policy</Button>
	</div>
</div>
