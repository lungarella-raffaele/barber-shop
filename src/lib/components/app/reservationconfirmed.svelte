<script>
	import { Button } from '$lib/components/ui/button';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import { formatDate, formatTime } from '$lib/utils';
	const { reservation, success, error } = $props();
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm mx-auto text-center dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
	>
		<div class="flex flex-col items-center text-center">
			{#if success}
				<h2>Prenotazione confermata</h2>
			{:else}
				<h2>C'è stato un problema con la conferma della prenotazione</h2>
			{/if}

			<p>
				{#if success}
					Grazie per la prenotazione. Di seguito i dettagli.
				{:else if error === 'expired'}
					La prenotazione è scaduta, prova ad effettuarne una nuova
				{:else}
					C'è stato un problema, riprova oppure chiama il numero {BARBER_SHOP_DETAILS.phone}
				{/if}
			</p>
		</div>
		{#if success && reservation}
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
		{/if}
		<Button href="/">Home</Button>
	</article>
</div>
