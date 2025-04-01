<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { formatDate, formatTime } from '$lib/utils';
	import { CircleCheckBig } from 'lucide-svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert mx-auto text-center"
	>
		{#if data.reservationConfirmed}
			<div class="flex flex-col items-center text-center">
				<CircleCheckBig size={30} class="mb-2" />
				<h2>Prenotazione confermata</h2>
				<p>Grazie per la prenotazione. Di seguito i dettagli.</p>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">Email</th>
						<td>{data.reservation.email}</td>
					</tr>

					<tr>
						<th scope="row">Nome</th>
						<td>{data.reservation.name}</td>
					</tr>

					<tr>
						<th scope="row">Data</th>
						<td>{formatDate(data.reservation.date)}</td>
					</tr>

					<tr>
						<th scope="row">Ora</th>
						<td>{formatTime(data.reservation.hour)}</td>
					</tr>
				</tbody>
			</table>
			<Button href="/">Home</Button>
		{:else}
			Non è stato possibile confermare la prenotazione, prova a crearne un altra
		{/if}
	</article>
</div>
