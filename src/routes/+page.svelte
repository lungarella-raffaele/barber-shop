<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';
	import PasswordRecover from './PasswordRecover.svelte';
	import Pendingreservation from './PendingReservation.svelte';
	import ReservationConfirmed from './ReservationConfirmed.svelte';
	import UserConfirmed from './UserConfirmed.svelte';
	import { ArrowUpRight, ChevronRight } from '$lib/components/icons';
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
	<div class="mb-8 mt-16 flex flex-col items-center p-4 text-center">
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

	<article class="prose dark:prose-invert">
		<h1>Chi sono</h1>
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
	<div class="mb-40 mt-10 flex flex-col gap-10">
		<img src="barber-shop.webp" alt="barber while working" class="max-w-[800px] rounded-md" />
		<img src="salon.webp" alt="salon" class="max-w-[800px] rounded-md" />
		<img src="working-picture.webp" alt="salon" class="max-w-[800px] rounded-md" />
	</div>
{/if}
