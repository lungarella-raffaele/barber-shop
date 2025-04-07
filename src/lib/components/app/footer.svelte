<script>
	import { Button } from '$lib/components/ui/button/index';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
</script>

<div
	class="flex flex-col lg:flex-row-reverse [&_*]:text-xs [&_*]:font-light [&_*]:text-muted-foreground"
>
	<div class="flex justify-center">
		<Button class="py-1" variant="link" href="Tel: 345 678 91011">
			{BARBER_SHOP_DETAILS.phone}
		</Button>
	</div>
	<div class="flex justify-center">
		<Button class="py-1" variant="link" href="#">
			{BARBER_SHOP_DETAILS.street}
		</Button>
	</div>
	<div class="mb-2 flex justify-center">
		<Button class="py-1" variant="link" href="/cookies">Cookies Policy</Button>
		<Button class="py-1" variant="link" href="/privacy">Privacy Policy</Button>
	</div>
</div>
