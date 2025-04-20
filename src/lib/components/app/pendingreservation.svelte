<script>
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import Timer from '$lib/composables/timer.svelte';
	import { BARBER_SHOP_DETAILS, LOCK_DURATION } from '$lib/constants';

	const { reservation, error, success } = $props();

	const timer = new Timer();

	if (browser && success) {
		const expiryTime = reservation.expiresAt.getTime();
		const currentTime = new Date().getTime();
		const timeLeft = expiryTime - currentTime;

		if (timeLeft > 0) {
			timer.start(timeLeft);
		}
	}
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm mx-auto text-center dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
	>
		<div class="flex flex-col items-center text-center">
			{#if success}
				<h2>Prenotazione in attesa</h2>
			{:else if error === 'expired'}
				<h2>La prenotazione è scaduta creane una nuova!</h2>
			{:else if error === 'server_error'}
				C'è stato un problema, riprova oppure chiama il numero {BARBER_SHOP_DETAILS.phone}
			{/if}

			{#if !timer.isEnded}
				<p>
					{#if success}
						Abbiamo inviato una mail all'indirizzo: <span
							class="font-semibold text-primary">{reservation.email}</span
						>. Controlla la tua casella di posta e conferma la tua prenotazione.
					{:else if error === 'expired'}
						La prenotazione è scaduta, prova ad effettuarne una nuova.
					{:else}
						C'è stato un problema, riprova oppure chiama il numero {BARBER_SHOP_DETAILS.phone}
					{/if}
				</p>
			{:else}
				<p>Il tempo è scaduto! Prova a fare un'altra prenotazione</p>
			{/if}
		</div>
		{#if success && reservation}
			<div class="text-center text-xl font-bold">
				<div class="mb-2">
					{timer.show()}
				</div>
				{#if !timer.isEnded}
					<Progress value={timer.timeLeft} max={LOCK_DURATION} />
				{:else}
					<Progress value={0} max={LOCK_DURATION} />

					<Button class="mt-8" data-sveltekit-reload href="/">Home</Button>
				{/if}
			</div>
		{/if}
	</article>
</div>
