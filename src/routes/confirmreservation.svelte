<script>
	import { Button } from '$lib/components/ui/button';
	import { formatDate, formatTime } from '$lib/utils';
	const { reservation, reservationConfirmed } = $props();
</script>

{#if reservationConfirmed}
	<div
		class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
	>
		<article
			class="prose prose-sm mx-auto text-center dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
		>
			<div class="flex flex-col items-center text-center">
				<h2>Prenotazione confermata</h2>
				<p>Grazie per la prenotazione. Di seguito i dettagli.</p>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">Email</th>
						<td>{reservation.email}</td>
					</tr>

					<tr>
						<th scope="row">Nome</th>
						<td>{reservation.name}</td>
					</tr>

					<tr>
						<th scope="row">Data</th>
						<td>{formatDate(reservation.date)}</td>
					</tr>

					<tr>
						<th scope="row">Ora</th>
						<td>{formatTime(reservation.hour)}</td>
					</tr>
				</tbody>
			</table>
			<Button href="/">Home</Button>
		</article>
	</div>
{:else}
	ERRRORONE
{/if}
