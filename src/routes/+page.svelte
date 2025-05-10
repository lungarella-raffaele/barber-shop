<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/app/logo.svelte';
	import PasswordRecover from '$lib/components/app/passwordrecover.svelte';
	import Pendingreservation from '$lib/components/app/pendingreservation.svelte';
	import ReservationConfirmed from '$lib/components/app/reservationconfirmed.svelte';
	import UserConfirmed from '$lib/components/app/userconfirmed.svelte';
	import { ArrowUpRight, ChevronRight } from '$lib/components/icons';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import type { PageProps } from './$types';
	import { getPageCase, PageCase } from './page-cases';

	const { data }: PageProps = $props();
	const pageCase = $derived(getPageCase(page.url));
</script>

<svelte:head>
	<meta
		name="description"
		content="Prenota il tuo appuntamento da Emi Hair Club, il salone di Emiliano Lo Russo. Tagli di capelli, barba e trattamenti personalizzati con un servizio professionale e di qualità. Prenota online in pochi secondi."
	/>
</svelte:head>

{#if pageCase === PageCase.PENDING_RESERVATION && data.reservation?.pending}
	<Pendingreservation reservation={data.reservation} error={data.error} success={data.success} />
{:else if pageCase === PageCase.CONFIRM_RESERVATION || (pageCase === PageCase.PENDING_RESERVATION && !data.reservation?.pending)}
	<ReservationConfirmed
		reservation={data.reservation}
		success={data.success}
		error={data.error}
	/>
{:else if pageCase === PageCase.CONFIRM_USER}
	<UserConfirmed success={data.success} error={data.error} />
{:else if pageCase === PageCase.RECOVER_PASSWORD}
	<PasswordRecover id={data.recoverID} success={data.success} error={data.error} />
{:else}
	<div class="mb-8 mt-16 flex flex-col items-center px-4 text-center">
		<Logo />

		<p class="mb-12 text-muted-foreground">
			Il tuo salone di fiducia per tagli di capelli unici e personalizzati.
		</p>

		<a
			class="flex items-center rounded-xl bg-primary p-3 px-5 text-lg font-semibold text-background"
			href="/newreservation"
		>
			<span class="ml-2">Prenota</span>
			<ChevronRight class="ml-1" />
		</a>
		<!-- <Button href="/newreservation">Prenota</Button> -->
		{#if BARBER_SHOP_DETAILS.phone}
			<p class="my-3 text-muted-foreground">oppure</p>
			<span>
				<a class="underline" href="Tel:{BARBER_SHOP_DETAILS.phone}">Chiama</a>
				al {BARBER_SHOP_DETAILS.phone || 'numero non disponibile'}
			</span>
		{/if}
	</div>

	<article class="prose p-4 dark:prose-invert">
		<h1>Chi sono</h1>
		<p>
			Gestito da Emiliano Lo Russo, il nostro salone offre servizi di alta qualità per uomini,
			donne e bambini. Siamo qui per valorizzare il tuo stile e farti sentire al meglio.
		</p>
		<Button variant="link" class="p-0 text-xl" href="/prices">
			Vedi tutti i servizi
			<ArrowUpRight />
		</Button>
		<Button
			variant="link"
			class="p-0 text-xl"
			target="_blank"
			href={BARBER_SHOP_DETAILS.instagram}
		>
			Seguimi su instagram
			<ArrowUpRight />
		</Button>
		<Button variant="link" class="p-0 text-xl" href={BARBER_SHOP_DETAILS.google_page}>
			Dove trovarmi
			<ArrowUpRight />
		</Button>
	</article>
	<AspectRatio ratio={14 / 9} class="rounded-15px scale-[0.9] bg-transparent">
		<img src="barber-shop.webp" alt="barber while working" class="rounded-md" />
	</AspectRatio>
	<AspectRatio ratio={14 / 9} class="scale-[0.9] bg-muted bg-transparent">
		<img src="salon.webp" alt="salon" class="rounded-md" />
	</AspectRatio>
	<AspectRatio ratio={14 / 9} class="scale-[0.9] bg-muted bg-transparent">
		<img src="working-picture.webp" alt="salon" class="rounded-md" />
	</AspectRatio>
{/if}
