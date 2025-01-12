<script>
	import { ArrowUpRight, MapPin, Phone } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button/index';

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
			><Phone />346 678 91011</Button
		>

		<Button variant="link" href="#" class="text-muted-foreground"
			><MapPin />Via San Sviluppo, 3 (PA)</Button
		>
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
