<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';
	import PasswordRecover from './PasswordRecover.svelte';
	import Pendingreservation from './PendingReservation.svelte';
	import ReservationConfirmed from './ReservationConfirmed.svelte';
	import UserConfirmed from './UserConfirmed.svelte';
	import { ArrowUpRight } from '$lib/components/icons';
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
	<Logo />

	<hr class="mt-8" />
	<article class="class= prose mt-4 dark:prose-invert">
		<h1 class="mb-4 text-3xl font-bold md:text-4xl">Chi sono</h1>
		<p>
			Gestito da Emiliano Lo Russo, il nostro salone offre servizi di alta qualità per uomini,
			donne e bambini. Siamo qui per valorizzare il tuo stile e farti sentire al meglio.
		</p>
		<div class="flex flex-col items-start">
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
		</div>
	</article>

	<hr class="mt-8" />

	<div class="mx-auto">
		<header class="mb-6 mt-8">
			<h1 class="mb-4 text-3xl font-bold md:text-4xl">La Nostra Galleria</h1>
			<p class="text-lg text-muted-foreground">
				Scopri il nostro salone e l'atmosfera che ti aspetta
			</p>
		</header>

		<section aria-label="Galleria fotografica del salone">
			<div class="grid auto-rows-[200px] grid-cols-1 gap-4 lg:grid-cols-4">
				<!-- Large 2x2 -->
				<div
					role="img"
					aria-label="Vista principale del salone EMI Hair Club con interni moderni"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center md:col-span-3"
					style="background-image: url('/barber-shop.webp')"
				></div>

				<!-- Tall 1x2 -->
				<div
					role="img"
					aria-label="Poltrona da barbiere professionale nel nostro salone"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center"
					style="background-image: url('/chair.webp')"
				></div>

				<div
					role="img"
					aria-label="Area reception e scrivania del salone"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center"
					style="background-image: url('/desk-wide.webp')"
				></div>

				<div
					role="img"
					aria-label="Interno del salone con vista completa delle postazioni di lavoro"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center md:col-span-3"
					style="background-image: url('/salon.webp')"
				></div>

				<div
					role="img"
					aria-label="Dettaglio della scrivania e area di lavoro del barbiere"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center md:col-span-3"
					style="background-image: url('/desk.webp')"
				></div>

				<div
					role="img"
					aria-label="Dettaglio della poltrona da barbiere con vista laterale"
					class="col-span-1 row-span-2 rounded-lg bg-cover bg-center"
					style="background-image: url('/chair-wide.webp')"
				></div>
			</div>
		</section>
	</div>
{/if}
