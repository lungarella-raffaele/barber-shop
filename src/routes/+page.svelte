<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/app/logo.svelte';
	import Pendingreservation from '$lib/components/app/pendingreservation.svelte';
	import ReservationConfirmed from '$lib/components/app/reservationconfirmed.svelte';
	import UserConfirmed from '$lib/components/app/userconfirmed.svelte';
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import type { PageProps } from './$types';
	import { getPageCase, PageCase } from './page-cases';

	const { data }: PageProps = $props();
	const pageCase = $derived(getPageCase(page.url));
</script>

{#if pageCase === PageCase.PENDING_RESERVATION && data.reservation?.pending}
	<Pendingreservation reservation={data.reservation} error={data.error} success={data.success} />
{:else if pageCase === PageCase.CONFIRM_RESERVATION || (pageCase === PageCase.PENDING_RESERVATION && !data.reservation?.pending)}
	<ReservationConfirmed
		reservation={data.reservation}
		success={data.success}
		error={data.error}
	/>
{:else if pageCase === PageCase.CONFIRM_USER}
	<UserConfirmed success={data.success} error={data.error} user={data.pendingUser} />
{:else}
	<div class="mb-16 mt-16 flex flex-col items-center">
		<Logo />

		<Button href="/newreservation">Prenota</Button>
		<p class="my-3 text-muted-foreground">oppure</p>
		<span>
			<a class="underline" href="Tel:{BARBER_SHOP_DETAILS.phone}">Chiama</a>
			al {BARBER_SHOP_DETAILS.phone || 'numero non disponibile'}
		</span>
	</div>
{/if}
