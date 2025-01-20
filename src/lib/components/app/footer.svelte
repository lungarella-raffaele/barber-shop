<script>
	import { ArrowUpRight, MapPin, Phone } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';

	const socials = [
		{
			title: 'instagram',
			url: '#'
		},
		{
			title: 'linkedin',
			url: '#'
		}
	];
</script>

<div class="flex flex-row flex-wrap p-2">
	<hr class="mb-3" />
	<div class="flex justify-between">
		<Button variant="link" href="Tel: 345 678 91011" class="text-muted-foreground"
			><Phone />{BARBER_SHOP_DETAILS.phone}</Button
		>

		<Button variant="link" href="#" class="text-muted-foreground"
			><MapPin />{BARBER_SHOP_DETAILS.street}
		</Button>
	</div>
	<div class="flex">
		{#each socials as s}
			<Button variant="link" href={s.url} class="text-muted-foreground">
				{s.title}
				<ArrowUpRight />
			</Button>
		{/each}
	</div>
	<div class="flex">
		<Button variant="link" href="/cookies" class="text-muted-foreground">Cookies Policy</Button>
		<Button variant="link" href="/privacy" class="text-muted-foreground">Privacy Policy</Button>
	</div>
</div>
